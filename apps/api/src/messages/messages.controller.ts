import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messages: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Mes conversations' })
  conversations(@Req() req: any) {
    return this.messages.listConversations(req.user.sub);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Messages d’une conversation (marque comme lu)' })
  getMessages(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.messages.getMessages(req.user.sub, id);
  }

  @Post()
  @ApiOperation({ summary: 'Démarrer une conversation / envoyer un message' })
  start(@Body() dto: SendMessageDto, @Req() req: any) {
    return this.messages.startConversation(req.user.sub, dto);
  }

  @Post('conversations/:id')
  @ApiOperation({ summary: 'Répondre dans une conversation' })
  reply(@Param('id', ParseIntPipe) id: number, @Body('body') body: string, @Req() req: any) {
    return this.messages.reply(req.user.sub, id, body);
  }
}
