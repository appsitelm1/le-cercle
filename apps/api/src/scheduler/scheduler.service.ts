import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ContractStatus,
  ContractType,
  ProfessionalStatus,
  SubscriptionStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MS = 24 * 3600 * 1000;

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async dailyMaintenance() {
    await this.expireSubscriptions();
    await this.remindContracts();
    await this.remindPayments();
    await this.remindExpiring();
  }

  /** Abonnements arrivés à échéance → EXPIRED + professionnel SUSPENDED. */
  private async expireSubscriptions() {
    const expired = await this.prisma.subscription.findMany({
      where: { status: SubscriptionStatus.ACTIVE, endDate: { lt: new Date() } },
    });
    for (const s of expired) {
      await this.prisma.subscription.update({
        where: { id: s.id },
        data: { status: SubscriptionStatus.EXPIRED },
      });
      await this.setProfessionalStatus(s.professionalType, s.professionalId, ProfessionalStatus.SUSPENDED);
      this.logger.log(`Abonnement ${s.id} expiré → professionnel suspendu`);
    }
  }

  /** Contrats envoyés non acceptés depuis > 7 jours. */
  private async remindContracts() {
    const cutoff = new Date(Date.now() - 7 * DAY_MS);
    const pending = await this.prisma.contract.findMany({
      where: { status: ContractStatus.SENT, createdAt: { lt: cutoff } },
    });
    for (const c of pending) {
      // Phase 4 : notifier (interne + email) avec lien de paiement
      this.logger.warn(`RAPPEL — contrat non accepté (contrat ${c.id}, pro ${c.professionalType}#${c.professionalId})`);
    }
  }

  /** Paiements en attente depuis > 7 jours. */
  private async remindPayments() {
    const cutoff = new Date(Date.now() - 7 * DAY_MS);
    const pending = await this.prisma.subscription.findMany({
      where: { status: SubscriptionStatus.PENDING_PAYMENT, createdAt: { lt: cutoff } },
    });
    for (const s of pending) {
      this.logger.warn(`RAPPEL — paiement en attente (abonnement ${s.id})`);
    }
  }

  /** Abonnements expirant sous 15 jours. */
  private async remindExpiring() {
    const soon = new Date(Date.now() + 15 * DAY_MS);
    const expiring = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: { lte: soon, gte: new Date() },
      },
    });
    for (const s of expiring) {
      this.logger.warn(`RAPPEL — abonnement bientôt expiré (abonnement ${s.id})`);
    }
  }

  private async setProfessionalStatus(
    type: ContractType,
    id: number,
    status: ProfessionalStatus,
  ) {
    if (type === ContractType.AGENT) {
      await this.prisma.agent.update({ where: { id }, data: { status } });
    } else if (type === ContractType.AGENCY) {
      await this.prisma.agency.update({ where: { id }, data: { status } });
    } else {
      await this.prisma.developer.update({ where: { id }, data: { status } });
    }
  }
}
