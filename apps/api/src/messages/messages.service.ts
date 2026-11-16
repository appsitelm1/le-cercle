import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async startConversation(userId: number, dto: SendMessageDto) {
    let proUserId = dto.toUserId;
    const listingId = dto.listingId;

    if (!proUserId && listingId) {
      const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
      if (!listing) throw new NotFoundException('listing_not_found');
      proUserId = listing.authorId;
    }
    if (!proUserId) throw new BadRequestException('destinataire_requis');
    if (proUserId === userId) throw new BadRequestException('self_message');

    let conversation = await this.prisma.conversation.findFirst({
      where: { listingId: listingId ?? null, buyerUserId: userId, proUserId },
    });
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { listingId, buyerUserId: userId, proUserId },
      });
    }

    const message = await this.prisma.message.create({
      data: { conversationId: conversation.id, senderId: userId, body: dto.body },
    });
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });
    return { conversation, message };
  }

  listConversations(userId: number) {
    return this.prisma.conversation.findMany({
      where: { OR: [{ buyerUserId: userId }, { proUserId: userId }] },
      include: {
        listing: { include: { images: { orderBy: { sort: 'asc' } } } },
        buyer: { select: { id: true, firstName: true, lastName: true } },
        pro: { select: { id: true, firstName: true, lastName: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(userId: number, conversationId: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conversation) throw new NotFoundException('conversation_not_found');
    // marquer comme lus les messages reçus
    await this.prisma.message.updateMany({
      where: { conversationId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });
    return conversation;
  }

  async reply(userId: number, conversationId: number, body: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) throw new NotFoundException('conversation_not_found');
    const message = await this.prisma.message.create({
      data: { conversationId, senderId: userId, body },
    });
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
    return message;
  }
}
