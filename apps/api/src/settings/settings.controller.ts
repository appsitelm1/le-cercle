import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleSlug } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SettingsService } from './settings.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleSlug.ADMIN, RoleSlug.SUPER_ADMIN)
@Controller('admin/settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Lire les paramètres (clé → valeur)' })
  get() {
    return this.settings.get();
  }

  @Patch()
  @ApiOperation({ summary: 'Mettre à jour les paramètres (clé → valeur)' })
  set(@Body() patch: Record<string, unknown>) {
    return this.settings.set(patch);
  }
}
