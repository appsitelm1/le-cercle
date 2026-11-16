import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateListingDto } from './dto/create-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingsService } from './listings.service';

@ApiTags('listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listings: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Rechercher / lister les annonces (filtres + tri + pagination)' })
  findAll(@Query() q: QueryListingsDto) {
    return this.listings.findAll(q);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes annonces (tous statuts)' })
  mine(@Req() req: any) {
    return this.listings.mine(req.user.sub);
  }

  @Get('mine/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes statistiques (annonces, vues, favoris, leads)' })
  mineStats(@Req() req: any) {
    return this.listings.mineStats(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d’une annonce' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listings.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une annonce (brouillon)' })
  create(@Body() dto: CreateListingDto, @Req() req: any) {
    return this.listings.create(dto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une annonce (propriétaire uniquement)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateListingDto, @Req() req: any) {
    return this.listings.update(id, dto, req.user.sub);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Changer le statut / mettre à la une (propriétaire uniquement)' })
  setStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: { status: any; featured?: boolean }, @Req() req: any) {
    return this.listings.setStatus(id, req.user.sub, dto);
  }

  @Patch(':id/labels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Définir les étiquettes d’une annonce (multi-sélection)' })
  setLabels(@Param('id', ParseIntPipe) id: number, @Body() dto: { labelIds: number[] }, @Req() req: any) {
    return this.listings.setLabels(id, req.user.sub, dto.labelIds ?? []);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une annonce (propriétaire uniquement)' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.listings.remove(id, req.user.sub);
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dupliquer une annonce' })
  duplicate(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.listings.duplicate(id, req.user.sub);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter une image (URL déjà uploadée) à une annonce' })
  addImage(@Param('id', ParseIntPipe) id: number, @Body('url') url: string, @Req() req: any) {
    return this.listings.addImage(id, url, req.user.sub);
  }
}
