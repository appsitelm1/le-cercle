import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadSource, LeadStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty() @IsInt() listingId: number;
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional({ enum: LeadSource }) @IsOptional() @IsEnum(LeadSource) source?: LeadSource;
  @ApiPropertyOptional() @IsOptional() @IsString() message?: string;
}

export class UpdateLeadDto {
  @ApiPropertyOptional({ enum: LeadStatus }) @IsOptional() @IsEnum(LeadStatus) status?: LeadStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
