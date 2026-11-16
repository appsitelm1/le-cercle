import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() listingId?: number;
  @ApiPropertyOptional({ description: 'Destinataire (professionnel) si pas d’annonce' })
  @IsOptional() @IsInt() toUserId?: number;
  @ApiProperty() @IsString() body: string;
}
