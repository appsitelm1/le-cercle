import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Assistant de recherche (chat naturel multilingue)' })
  send(@Body() dto: ChatDto) {
    return this.chat.chat(dto);
  }
}
