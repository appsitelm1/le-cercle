import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ContractType,
  ListingStatus,
  ProfessionalStatus,
  RoleSlug,
  UserStatus,
} from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async stats() {
    const [
      listings, published, pending, users, agents, agencies, developers,
      leads, payments, subscriptions, activeSubscriptions, conversations, messages, notifications,
    ] = await Promise.all([
      this.prisma.listing.count(),
      this.prisma.listing.count({ where: { status: ListingStatus.PUBLISHED } }),
      this.prisma.listing.count({ where: { status: ListingStatus.PENDING } }),
      this.prisma.user.count(),
      this.prisma.agent.count(),
      this.prisma.agency.count(),
      this.prisma.developer.count(),
      this.prisma.lead.count(),
      this.prisma.payment.count(),
      this.prisma.subscription.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      this.prisma.conversation.count(),
      this.prisma.message.count(),
      this.prisma.notification.count(),
    ]);

    return {
      listings, published, pending, users, agents, agencies, developers,
      leads, payments, subscriptions, activeSubscriptions, conversations, messages, notifications,
    };
  }

  listUsers() {
    return this.prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        agent: { include: { city: true, agency: true } },
        agencies: { include: { city: true } },
        developers: { include: { city: true } },
      },
    });
    if (!user) throw new NotFoundException('user_not_found');
    return user;
  }

  async createUser(dto: { email: string; password: string; firstName?: string; lastName?: string; role: RoleSlug }) {
    const role = await this.prisma.role.findUnique({ where: { slug: dto.role } });
    if (!role) throw new NotFoundException('role_inconnu');
    return this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: await argon2.hash(dto.password),
        firstName: dto.firstName ?? dto.email.split('@')[0],
        lastName: dto.lastName ?? '',
        locale: 'fr',
        status: UserStatus.ACTIVE,
        roleId: role.id,
      },
    });
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('user_not_found');
    });
    return { ok: true };
  }

  async updateUser(id: number, dto: { firstName?: string; lastName?: string; email?: string }) {
    return this.prisma.user.update({ where: { id }, data: dto }).catch(() => {
      throw new NotFoundException('user_not_found');
    });
  }

  async setUserStatus(id: number, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('user_not_found');
    await this.prisma.user.update({ where: { id }, data: { status } });
    // cascade : active/suspend aussi les profils professionnels liés
    const proStatus = status === UserStatus.ACTIVE ? ProfessionalStatus.ACTIVE : ProfessionalStatus.SUSPENDED;
    await this.prisma.agent.updateMany({ where: { userId: id }, data: { status: proStatus } });
    await this.prisma.agency.updateMany({ where: { ownerId: id }, data: { status: proStatus } });
    await this.prisma.developer.updateMany({ where: { ownerId: id }, data: { status: proStatus } });
    return { ok: true };
  }

  listListings(status?: ListingStatus) {
    return this.prisma.listing.findMany({
      where: status ? { status } : {},
      include: { author: { select: { email: true } }, city: true, type: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async setListingStatus(id: number, status: ListingStatus) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('listing_not_found');
    return this.prisma.listing.update({
      where: { id },
      data: {
        status,
        publishedAt: status === ListingStatus.PUBLISHED ? new Date() : listing.publishedAt,
      },
    });
  }

  async listProfessionals() {
    const [agents, agencies, developers] = await Promise.all([
      this.prisma.agent.findMany({ include: { user: { select: { email: true } } } }),
      this.prisma.agency.findMany({ include: { owner: { select: { email: true } } } }),
      this.prisma.developer.findMany({ include: { owner: { select: { email: true } } } }),
    ]);
    return { agents, agencies, developers };
  }

  async setProfessionalStatus(type: ContractType, id: number, status: ProfessionalStatus) {
    if (type === ContractType.AGENT) {
      await this.ensure(this.prisma.agent.findUnique({ where: { id } }), 'agent_not_found');
      return this.prisma.agent.update({ where: { id }, data: { status } });
    }
    if (type === ContractType.AGENCY) {
      await this.ensure(this.prisma.agency.findUnique({ where: { id } }), 'agency_not_found');
      return this.prisma.agency.update({ where: { id }, data: { status } });
    }
    await this.ensure(this.prisma.developer.findUnique({ where: { id } }), 'developer_not_found');
    return this.prisma.developer.update({ where: { id }, data: { status } });
  }

  private async ensure<T>(value: Promise<T>, msg: string): Promise<T> {
    const v = await value;
    if (!v) throw new NotFoundException(msg);
    return v;
  }
}
