import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ProfessionalStatus, RoleSlug } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/slugify';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterProDto } from './dto/register-pro.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) {
      throw new ConflictException('email_exists');
    }

    // rôle USER créé s'il manque (seed d'appoint)
    const role = await this.prisma.role.upsert({
      where: { slug: RoleSlug.USER },
      update: {},
      create: { slug: RoleSlug.USER, name: 'Utilisateur', permissions: [] },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash: await argon2.hash(dto.password),
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        locale: dto.locale ?? 'fr',
        roleId: role.id,
        status: 'ACTIVE',
      },
    });

    return this.issueTokens(user.id, user.email, role.slug);
  }

  async registerPro(dto: RegisterProDto) {
    const email = dto.email.toLowerCase();
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('email_exists');

    const role = await this.prisma.role.findUnique({ where: { slug: dto.role } });
    if (!role) throw new ConflictException('role_inconnu');

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: await argon2.hash(dto.password),
        firstName: dto.firstName ?? email.split('@')[0],
        lastName: dto.lastName ?? '',
        locale: 'fr',
        roleId: role.id,
        status: 'PENDING',
      },
    });

    const proStatus = ProfessionalStatus.RECEIVED;
    if (dto.role === RoleSlug.AGENT) {
      await this.prisma.agent.create({
        data: { userId: user.id, phone: dto.phone, whatsapp: dto.whatsapp, bio: dto.bio, licenseNumber: dto.licenseNumber, cityId: dto.cityId, status: proStatus },
      });
    } else if (dto.role === RoleSlug.AGENCY) {
      await this.prisma.agency.create({
        data: { ownerId: user.id, name: dto.name ?? 'Agence', slug: `${slugify(dto.name ?? 'agence')}-${user.id}`, email, phone: dto.phone, website: dto.website, cityId: dto.cityId, description: dto.description, status: proStatus },
      });
    } else if (dto.role === RoleSlug.PROMOTER) {
      await this.prisma.developer.create({
        data: { ownerId: user.id, name: dto.name ?? 'Promoteur', slug: `${slugify(dto.name ?? 'promoteur')}-${user.id}`, email, phone: dto.phone, website: dto.website, cityId: dto.cityId, description: dto.description, status: proStatus },
      });
    }

    return { ok: true, pending: true };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException('invalid_credentials');
    }
    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) {
      throw new UnauthorizedException('invalid_credentials');
    }
    const role = await this.prisma.role.findUnique({ where: { id: user.roleId } });
    return this.issueTokens(user.id, user.email, role?.slug ?? RoleSlug.USER);
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('missing_refresh_token');
    }
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('invalid_token');
      }
      const role = await this.prisma.role.findUnique({ where: { id: user.roleId } });
      return this.issueTokens(user.id, user.email, role?.slug ?? RoleSlug.USER);
    } catch {
      throw new UnauthorizedException('invalid_token');
    }
  }

  private issueTokens(sub: number, email: string, role: RoleSlug) {
    const accessSecret = process.env.JWT_ACCESS_SECRET ?? 'change-me-access';
    const refreshSecret = process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh';
    return {
      accessToken: this.jwt.sign(
        { sub, email, role },
        { secret: accessSecret, expiresIn: process.env.JWT_ACCESS_TTL ?? '15m' },
      ),
      refreshToken: this.jwt.sign(
        { sub },
        { secret: refreshSecret, expiresIn: process.env.JWT_REFRESH_TTL ?? '7d' },
      ),
    };
  }
}
