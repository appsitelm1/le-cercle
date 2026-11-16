import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('catalog')
@Controller()
export class CatalogController {
  constructor(private prisma: PrismaService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Lister les catégories / types de biens' })
  categories() {
    return this.prisma.category.findMany({ orderBy: { sort: 'asc' } });
  }

  @Get('labels')
  @ApiOperation({ summary: 'Lister les étiquettes disponibles' })
  labels() {
    return this.prisma.label.findMany({ orderBy: { sort: 'asc' } });
  }

  @Get('geo/cities')
  @ApiOperation({ summary: 'Lister les villes (référentiel géographique)' })
  cities(@Query('countryId') countryId?: string) {
    return this.prisma.city.findMany({
      where: countryId ? { countryId: Number(countryId) } : {},
      orderBy: { name: 'asc' },
      take: 200,
    });
  }

  @Get('geo/countries')
  @ApiOperation({ summary: 'Lister les pays' })
  countries() {
    return this.prisma.country.findMany({ orderBy: { name: 'asc' } });
  }
}
