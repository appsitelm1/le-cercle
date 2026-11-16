import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ContractStatus,
  ContractType,
  PaymentMethod,
  PaymentStatus,
  ProfessionalStatus,
  SubscriptionStatus,
  UserStatus,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/slugify';
import { RegisterAgentDto, RegisterAgencyDto, RegisterDeveloperDto } from './dto/register.dto';

// Prix annuel par défaut (configurable par l'admin en phase 5)
const DEFAULT_ANNUAL_PRICE = 3000;

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) {}

  async registerAgent(dto: RegisterAgentDto, userId: number) {
    const exists = await this.prisma.agent.findUnique({ where: { userId } });
    if (exists) throw new BadRequestException('agent_exists');

    const { firstName, lastName, ...rest } = dto as any;
    const agent = await this.prisma.agent.create({
      data: { userId, ...rest, status: ProfessionalStatus.RECEIVED },
    });
    if (firstName || lastName) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { ...(firstName ? { firstName } : {}), ...(lastName ? { lastName } : {}) },
      });
    }
    const contract = await this.createContract(ContractType.AGENT, agent.id);
    await this.prisma.agent.update({
      where: { id: agent.id },
      data: { status: ProfessionalStatus.CONTRACT_SENT },
    });
    return { agent, contract };
  }

  async registerAgency(dto: RegisterAgencyDto, userId: number) {
    const exists = await this.prisma.agency.findFirst({ where: { ownerId: userId } });
    if (exists) throw new BadRequestException('agency_exists');

    const agency = await this.prisma.agency.create({
      data: { ownerId: userId, ...dto, slug: slugify(dto.name), status: ProfessionalStatus.RECEIVED },
    });
    const contract = await this.createContract(ContractType.AGENCY, agency.id);
    await this.prisma.agency.update({
      where: { id: agency.id },
      data: { status: ProfessionalStatus.CONTRACT_SENT },
    });
    return { agency, contract };
  }

  async registerDeveloper(dto: RegisterDeveloperDto, userId: number) {
    const exists = await this.prisma.developer.findFirst({ where: { ownerId: userId } });
    if (exists) throw new BadRequestException('developer_exists');

    const developer = await this.prisma.developer.create({
      data: { ownerId: userId, ...dto, slug: slugify(dto.name), status: ProfessionalStatus.RECEIVED },
    });
    const contract = await this.createContract(ContractType.DEVELOPER, developer.id);
    await this.prisma.developer.update({
      where: { id: developer.id },
      data: { status: ProfessionalStatus.CONTRACT_SENT },
    });
    return { developer, contract };
  }

  async acceptContract(contractId: number, ip?: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id: contractId } });
    if (!contract) throw new NotFoundException('contract_not_found');

    const acceptance = await this.prisma.contractAcceptance.upsert({
      where: { contractId },
      update: {},
      create: { contractId, ip, version: contract.version },
    });
    await this.prisma.contract.update({
      where: { id: contractId },
      data: { status: ContractStatus.ACCEPTED },
    });

    const subscription = await this.prisma.subscription.create({
      data: {
        professionalType: contract.professionalType,
        professionalId: contract.professionalId,
        contractId,
        price: contract.annualPrice,
        currencyCode: contract.currencyCode,
        status: SubscriptionStatus.PENDING_PAYMENT,
      },
    });

    await this.setProfessionalStatus(
      contract.professionalType,
      contract.professionalId,
      ProfessionalStatus.CONTRACT_ACCEPTED,
    );
    return { acceptance, subscription };
  }

  async pay(subscriptionId: number, method: PaymentMethod = PaymentMethod.CARD) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });
    if (!subscription) throw new NotFoundException('subscription_not_found');

    // En production : PENDING puis webhook du fournisseur (CMI/Stripe) → SUCCEEDED.
    const payment = await this.prisma.payment.create({
      data: {
        subscriptionId,
        amount: subscription.price,
        currencyCode: subscription.currencyCode,
        reference: `PAY-${randomUUID().slice(0, 8).toUpperCase()}`,
        method,
        status: PaymentStatus.SUCCEEDED,
        paidAt: new Date(),
      },
    });

    const invoiceCount = await this.prisma.invoice.count();
    const invoice = await this.prisma.invoice.create({
      data: {
        paymentId: payment.id,
        number: `FACT-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`,
      },
    });

    const start = new Date();
    const end = new Date(start);
    end.setFullYear(end.getFullYear() + 1);
    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: SubscriptionStatus.ACTIVE, startDate: start, endDate: end },
    });

    await this.setProfessionalStatus(
      subscription.professionalType,
      subscription.professionalId,
      ProfessionalStatus.PAYMENT_RECEIVED,
    );
    return { payment, invoice };
  }

  async activate(type: ContractType, id: number) {
    await this.setProfessionalStatus(type, id, ProfessionalStatus.ACTIVE);
    return { ok: true };
  }

  async status(type: ContractType, id: number) {
    if (type === ContractType.AGENT) return this.prisma.agent.findUnique({ where: { id } });
    if (type === ContractType.AGENCY) return this.prisma.agency.findUnique({ where: { id } });
    return this.prisma.developer.findUnique({ where: { id } });
  }

  listAgents() {
    return this.prisma.agent.findMany({
      where: { status: ProfessionalStatus.ACTIVE, user: { status: UserStatus.ACTIVE } },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } }, city: true },
    });
  }

  listAgencies() {
    return this.prisma.agency.findMany({
      where: { status: ProfessionalStatus.ACTIVE, owner: { status: UserStatus.ACTIVE } },
      include: { city: true, agents: true },
    });
  }

  listDevelopers() {
    return this.prisma.developer.findMany({
      where: { status: ProfessionalStatus.ACTIVE, owner: { status: UserStatus.ACTIVE } },
      include: { city: true },
    });
  }

  async me(userId: number) {
    const [agent, agencies, developers] = await Promise.all([
      this.prisma.agent.findUnique({ where: { userId } }),
      this.prisma.agency.findMany({ where: { ownerId: userId } }),
      this.prisma.developer.findMany({ where: { ownerId: userId } }),
    ]);

    const agentData = agent ? { ...agent, ...(await this.withContract(ContractType.AGENT, agent.id)) } : null;
    const agencyData = await Promise.all(
      agencies.map(async (a) => ({ ...a, ...(await this.withContract(ContractType.AGENCY, a.id)) })),
    );
    const developerData = await Promise.all(
      developers.map(async (d) => ({ ...d, ...(await this.withContract(ContractType.DEVELOPER, d.id)) })),
    );

    return { agent: agentData, agencies: agencyData, developers: developerData };
  }

  async updateMe(userId: number, dto: { bio?: string; phone?: string; whatsapp?: string; cityId?: number }) {
    const agent = await this.prisma.agent.findUnique({ where: { userId } });
    if (!agent) throw new NotFoundException('agent_not_found');
    return this.prisma.agent.update({ where: { userId }, data: dto });
  }

  private async withContract(type: ContractType, professionalId: number) {
    const contract = await this.prisma.contract.findFirst({
      where: { professionalType: type, professionalId },
      orderBy: { id: 'desc' },
    });
    const subscription = contract
      ? await this.prisma.subscription.findUnique({ where: { contractId: contract.id } })
      : null;
    return { contract, subscription };
  }

  private createContract(type: ContractType, professionalId: number) {
    return this.prisma.contract.create({
      data: {
        professionalType: type,
        professionalId,
        content:
          'Contrat professionnel « le cercle » — modèle par défaut, modifiable depuis l’administration.',
        annualPrice: DEFAULT_ANNUAL_PRICE,
        status: ContractStatus.SENT,
        sentAt: new Date(),
      },
    });
  }

  private async setProfessionalStatus(type: ContractType, id: number, status: ProfessionalStatus) {
    if (type === ContractType.AGENT) {
      await this.prisma.agent.update({ where: { id }, data: { status } });
    } else if (type === ContractType.AGENCY) {
      await this.prisma.agency.update({ where: { id }, data: { status } });
    } else {
      await this.prisma.developer.update({ where: { id }, data: { status } });
    }
  }
}
