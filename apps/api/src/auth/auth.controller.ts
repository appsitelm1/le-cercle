import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleSlug } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterProDto } from './dto/register-pro.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscription utilisateur' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('register-pro')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inscription pro (agent / agence / promoteur) — en attente de validation admin' })
  registerPro(@Body() dto: RegisterProDto) {
    return this.auth.registerPro(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion (access + refresh)' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renouveler les jetons' })
  refresh(@Body('refreshToken') refreshToken?: string) {
    return this.auth.refresh(refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil du compte connecté' })
  me(@Req() req: any) {
    return req.user;
  }

  @Get('admin-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleSlug.ADMIN, RoleSlug.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Route de démonstration réservée aux admins (RBAC)' })
  adminCheck() {
    return { ok: true, message: 'accès admin autorisé' };
  }
}
