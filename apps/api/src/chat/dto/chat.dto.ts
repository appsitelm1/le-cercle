import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'] })
  role: 'user' | 'assistant';

  @ApiProperty()
  content: string;
}

export class ChatDto {
  @ApiProperty({ type: [ChatMessageDto] })
  @IsArray()
  messages: ChatMessageDto[];

  @ApiPropertyOptional({ description: 'Langue de réponse (fr, en, es, ar)' })
  @IsOptional()
  @IsString()
  locale?: string;
}
