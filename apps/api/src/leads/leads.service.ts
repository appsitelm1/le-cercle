import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadSource, LeadStatus, NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto, userId?: number) {
    const listing = await this.prisma.listing.findUnique({ where: { id: dto.listingId } });
    if (!listing) throw new NotFoundException('listing_not_found');

    const lead = await this.prisma.lead.create({
      data: {
        listingId: dto.listingId,
        proUserId: listing.authorId,
        userId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        source: dto.source ?? LeadSource.FORM,
      },
    });
    await this.prisma.leadEvent.create({
      data: { leadId: lead.id, type: 'created', meta: { source: lead.source, message: dto.message } },
    });
    // notification interne au professionnel
    await this.prisma.notification.create({
      data: {
        userId: listing.authorId,
        type: NotificationType.LEAD,
        title: 'Nouveau contact',
        body: `${dto.name} s’intéresse à « ${listing.title} »`,
        data: { leadId: lead.id, listingId: listing.id },
      },
    });
    return lead;
  }

  listMine(userId: number, status?: LeadStatus) {
    return this.prisma.lead.findMany({
      where: { proUserId: userId, ...(status ? { status } : {}) },
      include: { listing: { select: { id: true, title: true, ref: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(id: number, userId: number, dto: UpdateLeadDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead || lead.proUserId !== userId) throw new NotFoundException('lead_not_found');
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  async addEvent(id: number, userId: number, type: string, meta?: unknown) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead || lead.proUserId !== userId) throw new NotFoundException('lead_not_found');
    await this.prisma.leadEvent.create({ data: { leadId: id, type, meta: (meta as object) ?? undefined } });
    await this.prisma.lead.update({ where: { id }, data: { lastInteractionAt: new Date() } });
    return { ok: true };
  }
}
