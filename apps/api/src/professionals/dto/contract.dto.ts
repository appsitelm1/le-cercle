import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class AcceptContractDto {
  @ApiPropertyOptional({ description: 'IP de consultation (traçabilité signature électronique)' })
  @IsOptional()
  ip?: string;
}

export class PayDto {
  @ApiPropertyOptional({ enum: PaymentMethod, default: PaymentMethod.CARD })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;
}
