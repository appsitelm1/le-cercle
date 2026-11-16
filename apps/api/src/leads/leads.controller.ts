import {
  Body,
  Controller,
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
import { LeadStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLeadDto, UpdateLeadDto } from './dto/lead.dto';
import { LeadsService } from './leads.service';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un lead (contact) — depuis la fiche annonce' })
  create(@Body() dto: CreateLeadDto) {
    return this.leads.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes leads (professionnel)' })
  list(@Req() req: any, @Query('status') status?: LeadStatus) {
    return this.leads.listMine(req.user.sub, status);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour le statut / notes d’un lead' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLeadDto, @Req() req: any) {
    return this.leads.update(id, req.user.sub, dto);
  }

  @Post(':id/events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un événement au lead (historique)' })
  addEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body('type') type: string,
    @Body('meta') meta: unknown,
    @Req() req: any,
  ) {
    return this.leads.addEvent(id, req.user.sub, type, meta);
  }
}
