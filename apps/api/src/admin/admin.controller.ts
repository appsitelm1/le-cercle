import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContractType, ListingStatus, ProfessionalStatus, RoleSlug, UserStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleSlug.ADMIN, RoleSlug.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques globales (dashboard admin)' })
  stats() {
    return this.admin.stats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Lister les utilisateurs' })
  users() {
    return this.admin.listUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Détail d’un utilisateur (compte + profils professionnels)' })
  user(@Param('id', ParseIntPipe) id: number) {
    return this.admin.getUser(id);
  }

  @Post('users')
  @ApiOperation({ summary: 'Créer un utilisateur (avec rôle)' })
  createUser(@Body() dto: { email: string; password: string; firstName?: string; lastName?: string; role: RoleSlug }) {
    return this.admin.createUser(dto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.admin.deleteUser(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Modifier le profil d’un utilisateur (nom, prénom, email)' })
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: { firstName?: string; lastName?: string; email?: string }) {
    return this.admin.updateUser(id, dto);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Changer le statut d’un utilisateur (suspendre / bloquer)' })
  setUserStatus(@Param('id', ParseIntPipe) id: number, @Body('status', new ParseEnumPipe(UserStatus)) status: UserStatus) {
    return this.admin.setUserStatus(id, status);
  }

  @Get('listings')
  @ApiOperation({ summary: 'Lister les annonces (modération)' })
  listings(@Query('status', new ParseEnumPipe(ListingStatus, { optional: true })) status?: ListingStatus) {
    return this.admin.listListings(status);
  }

  @Patch('listings/:id/status')
  @ApiOperation({ summary: 'Publier / dépublier / refuser une annonce' })
  setListingStatus(@Param('id', ParseIntPipe) id: number, @Body('status', new ParseEnumPipe(ListingStatus)) status: ListingStatus) {
    return this.admin.setListingStatus(id, status);
  }

  @Get('professionals')
  @ApiOperation({ summary: 'File de validation des professionnels' })
  professionals() {
    return this.admin.listProfessionals();
  }

  @Patch('professionals/:type/:id/status')
  @ApiOperation({ summary: 'Valider / refuser / suspendre un professionnel' })
  setProfessionalStatus(
    @Param('type', new ParseEnumPipe(ContractType)) type: ContractType,
    @Param('id', ParseIntPipe) id: number,
    @Body('status', new ParseEnumPipe(ProfessionalStatus)) status: ProfessionalStatus,
  ) {
    return this.admin.setProfessionalStatus(type, id, status);
  }
}
