import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateListingDto, userId: number) {
    const { labelIds, images, ...rest } = dto as any;
    const listing = await this.prisma.listing.create({
      data: {
        ref: `LC-${randomUUID().slice(0, 8).toUpperCase()}`,
        ...rest,
        status: ListingStatus.DRAFT,
        authorId: userId,
        images: Array.isArray(images) && images.length
          ? { create: images.map((im: any, i: number) => ({ url: im.url, alt: im.alt, isPrimary: im.isPrimary ?? i === 0, sort: i })) }
          : undefined,
      },
    });
    if (Array.isArray(labelIds) && labelIds.length) {
      await this.prisma.listingLabel.createMany({
        data: labelIds.map((labelId: number) => ({ listingId: listing.id, labelId })),
      });
    }
    return listing;
  }

  async setLabels(id: number, userId: number, labelIds: number[]) {
    await this.ensureOwner(id, userId);
    await this.prisma.listingLabel.deleteMany({ where: { listingId: id } });
    if (Array.isArray(labelIds) && labelIds.length) {
      await this.prisma.listingLabel.createMany({
        data: labelIds.map((labelId) => ({ listingId: id, labelId })),
      });
    }
    return { ok: true };
  }

  mine(userId: number) {
    return this.prisma.listing.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { orderBy: { sort: 'asc' } },
        city: true,
        type: true,
        labels: { include: { label: true } },
      },
    });
  }

  async mineStats(userId: number) {
    const listings = await this.prisma.listing.findMany({
      where: { authorId: userId },
      select: { status: true, views: true, featured: true },
    });
    const totalViews = listings.reduce((s, l) => s + l.views, 0);
    const byStatus: Record<string, number> = {};
    for (const l of listings) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
    const [favorites, leads] = await Promise.all([
      this.prisma.favorite.count({ where: { listing: { authorId: userId } } }),
      this.prisma.lead.count({ where: { listing: { authorId: userId } } }),
    ]);
    return {
      totalListings: listings.length,
      totalViews,
      featured: listings.filter((l) => l.featured).length,
      byStatus,
      favorites,
      leads,
    };
  }

  async duplicate(id: number, userId: number) {
    const src = await this.prisma.listing.findUnique({ where: { id }, include: { images: true } });
    if (!src) throw new NotFoundException('listing_not_found');

    return this.prisma.listing.create({
      data: {
        title: `${src.title} (copie)`,
        description: src.description,
        transaction: src.transaction,
        price: src.price,
        currencyCode: src.currencyCode,
        typeId: src.typeId,
        countryId: src.countryId,
        regionId: src.regionId,
        cityId: src.cityId,
        neighborhoodId: src.neighborhoodId,
        address: src.address,
        lat: src.lat,
        lng: src.lng,
        surface: src.surface,
        landSurface: src.landSurface,
        bedrooms: src.bedrooms,
        bathrooms: src.bathrooms,
        floors: src.floors,
        parking: src.parking,
        elevator: src.elevator,
        terrace: src.terrace,
        garden: src.garden,
        pool: src.pool,
        seaView: src.seaView,
        furnished: src.furnished,
        ref: `LC-${randomUUID().slice(0, 8).toUpperCase()}`,
        status: ListingStatus.DRAFT,
        authorId: userId,
        images: {
          create: src.images.map((im) => ({
            url: im.url,
            alt: im.alt,
            sort: im.sort,
            isPrimary: im.isPrimary,
          })),
        },
      },
    });
  }

  async findAll(q: QueryListingsDto) {
    const page = q.page ?? 1;
    const limit = Math.min(q.limit ?? 12, 50);
    const where = this.buildWhere(q);
    const orderBy = this.buildOrderBy(q.sort);

    const [items, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { sort: 'asc' } },
          city: true,
          type: true,
          labels: { include: { label: true } },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: number) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sort: 'asc' } },
        features: { include: { feature: true } },
        city: true,
        neighborhood: true,
        region: true,
        country: true,
        type: true,
        labels: { include: { label: true } },
        author: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    if (!listing) throw new NotFoundException('listing_not_found');
    await this.prisma.listing.update({ where: { id }, data: { views: { increment: 1 } } });
    return { ...listing, views: listing.views + 1 };
  }

  async update(id: number, dto: UpdateListingDto, userId: number) {
    await this.ensureOwner(id, userId);
    const { labelIds, images, ...rest } = dto as any;
    return this.prisma.listing.update({
      where: { id },
      data: {
        ...rest,
        ...(images ? { images: { deleteMany: {}, create: images.map((im: any, i: number) => ({ url: im.url, alt: im.alt, isPrimary: im.isPrimary ?? i === 0, sort: i })) } } : {}),
      },
    });
  }

  async setStatus(id: number, userId: number, dto: { status: ListingStatus; featured?: boolean }) {
    await this.ensureOwner(id, userId);
    const data: { status: ListingStatus; featured?: boolean } = { status: dto.status };
    if (typeof dto.featured === 'boolean') data.featured = dto.featured;
    return this.prisma.listing.update({ where: { id }, data });
  }

  async remove(id: number, userId: number) {
    await this.ensureOwner(id, userId);
    await this.prisma.listing.delete({ where: { id } });
    return { ok: true };
  }

  async addImage(id: number, url: string, userId: number) {
    await this.ensureOwner(id, userId);
    return this.prisma.listingImage.create({
      data: { listingId: id, url, sort: 0 },
    });
  }

  async toggleFavorite(userId: number, listingId: number) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('listing_not_found');

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });
    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }
    await this.prisma.favorite.create({ data: { userId, listingId } });
    return { favorited: true };
  }

  listFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { listing: { include: { images: { orderBy: { sort: 'asc' } }, city: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async ensureOwner(id: number, userId: number) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('listing_not_found');
    if (listing.authorId !== userId) throw new ForbiddenException('not_owner');
  }

  private buildWhere(q: QueryListingsDto): Prisma.ListingWhereInput {
    const where: Prisma.ListingWhereInput = { status: ListingStatus.PUBLISHED };

    if (q.transaction) where.transaction = q.transaction;
    if (q.typeId) where.typeId = q.typeId;
    if (q.cityId) where.cityId = q.cityId;
    if (q.regionId) where.regionId = q.regionId;
    if (q.countryId) where.countryId = q.countryId;
    if (q.neighborhoodId) where.neighborhoodId = q.neighborhoodId;

    const parseIds = (s?: string) => (s ? s.split(',').map((n) => Number(n)).filter((n) => !Number.isNaN(n)) : []);
    const typeIds = parseIds(q.typeIds);
    const cityIds = parseIds(q.cityIds);
    const countryIds = parseIds(q.countryIds);
    if (typeIds.length) where.typeId = { in: typeIds };
    if (cityIds.length) where.cityId = { in: cityIds };
    if (countryIds.length) where.countryId = { in: countryIds };

    const transactions = (q.transactions ?? '').split(',').filter((x) => x === 'SALE' || x === 'RENT');
    if (transactions.length) where.transaction = { in: transactions as any };
    if (q.bedrooms) where.bedrooms = { gte: q.bedrooms };
    if (q.bathrooms) where.bathrooms = { gte: q.bathrooms };
    if (q.surfaceMin) where.surface = { gte: q.surfaceMin };

    if (q.priceMin != null || q.priceMax != null) {
      where.price = {};
      if (q.priceMin != null) where.price.gte = q.priceMin;
      if (q.priceMax != null) where.price.lte = q.priceMax;
    }

    if (q.q) {
      where.OR = [
        { title: { contains: q.q, mode: 'insensitive' } },
        { description: { contains: q.q, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private buildOrderBy(sort?: string): Prisma.ListingOrderByWithRelationInput {
    switch (sort) {
      case 'price_asc':
        return { price: 'asc' };
      case 'price_desc':
        return { price: 'desc' };
      case 'surface':
        return { surface: 'desc' };
      default:
        return { createdAt: 'desc' };
    }
  }
}
