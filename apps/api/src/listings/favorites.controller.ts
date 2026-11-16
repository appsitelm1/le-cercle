import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListingsService } from './listings.service';

@ApiTags('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly listings: ListingsService) {}

  @Get()
  @ApiOperation({ summary: 'Mes favoris' })
  list(@Req() req: any) {
    return this.listings.listFavorites(req.user.sub);
  }

  @Post(':listingId')
  @ApiOperation({ summary: 'Ajouter / retirer un favori (toggle)' })
  toggle(@Param('listingId', ParseIntPipe) listingId: number, @Req() req: any) {
    return this.listings.toggleFavorite(req.user.sub, listingId);
  }
}
