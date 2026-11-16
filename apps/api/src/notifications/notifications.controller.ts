import { Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Mes notifications' })
  list(@Req() req: any) {
    return this.notifications.list(req.user.sub);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Nombre de notifications non lues' })
  unread(@Req() req: any) {
    return this.notifications.unreadCount(req.user.sub);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  read(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.notifications.markRead(req.user.sub, id);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Tout marquer comme lu' })
  readAll(@Req() req: any) {
    return this.notifications.markAllRead(req.user.sub);
  }
}
