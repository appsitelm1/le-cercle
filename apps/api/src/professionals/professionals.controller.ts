import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContractType, RoleSlug } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AcceptContractDto, PayDto } from './dto/contract.dto';
import { RegisterAgentDto, RegisterAgencyDto, RegisterDeveloperDto } from './dto/register.dto';
import { ProfessionalsService } from './professionals.service';

@ApiTags('professionals')
@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly svc: ProfessionalsService) {}

  @Post('agent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Devenir agent (inscription → contrat envoyé)' })
  registerAgent(@Body() dto: RegisterAgentDto, @Req() req: any) {
    return this.svc.registerAgent(dto, req.user.sub);
  }

  @Post('agency')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscrire une agence' })
  registerAgency(@Body() dto: RegisterAgencyDto, @Req() req: any) {
    return this.svc.registerAgency(dto, req.user.sub);
  }

  @Post('developer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inscrire un promoteur' })
  registerDeveloper(@Body() dto: RegisterDeveloperDto, @Req() req: any) {
    return this.svc.registerDeveloper(dto, req.user.sub);
  }

  @Get('agents')
  @ApiOperation({ summary: 'Lister les agents' })
  listAgents() {
    return this.svc.listAgents();
  }

  @Get('agencies')
  @ApiOperation({ summary: 'Lister les agences' })
  listAgencies() {
    return this.svc.listAgencies();
  }

  @Get('developers')
  @ApiOperation({ summary: 'Lister les promoteurs' })
  listDevelopers() {
    return this.svc.listDevelopers();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes profils professionnels (agent / agences / promoteurs + contrat + abonnement)' })
  me(@Req() req: any) {
    return this.svc.me(req.user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour mon profil agent (bio, téléphone, WhatsApp, ville)' })
  updateMe(@Body() dto: { bio?: string; phone?: string; whatsapp?: string; cityId?: number }, @Req() req: any) {
    return this.svc.updateMe(req.user.sub, dto);
  }

  @Post('contracts/:id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accepter le contrat (signature électronique tracée)' })
  acceptContract(@Param('id', ParseIntPipe) id: number, @Body() dto: AcceptContractDto, @Req() req: any) {
    return this.svc.acceptContract(id, dto.ip ?? req.ip);
  }

  @Post('subscriptions/:id/pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Payer l’abonnement (facture générée, abonnement activé)' })
  pay(@Param('id', ParseIntPipe) id: number, @Body() dto: PayDto) {
    return this.svc.pay(id, dto.method);
  }

  @Patch(':type/:id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleSlug.ADMIN, RoleSlug.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activer un professionnel (validation admin)' })
  activate(
    @Param('type', new ParseEnumPipe(ContractType)) type: ContractType,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.svc.activate(type, id);
  }
}
