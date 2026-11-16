import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class QueryListingsDto {
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;

  @ApiPropertyOptional({ default: 12 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 12;

  @ApiPropertyOptional({ enum: TransactionType }) @IsOptional() @IsEnum(TransactionType) transaction?: TransactionType;

  @ApiPropertyOptional({ description: 'Plusieurs transactions (SALE,RENT)' }) @IsOptional() @IsString() transactions?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() typeId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() cityId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() regionId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() countryId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() neighborhoodId?: number;

  @ApiPropertyOptional({ description: 'Plusieurs types (ids séparés par des virgules)' }) @IsOptional() @IsString() typeIds?: string;
  @ApiPropertyOptional({ description: 'Plusieurs villes (ids séparés par des virgules)' }) @IsOptional() @IsString() cityIds?: string;
  @ApiPropertyOptional({ description: 'Plusieurs pays (ids séparés par des virgules)' }) @IsOptional() @IsString() countryIds?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() priceMin?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() priceMax?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() bedrooms?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() bathrooms?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() surfaceMin?: number;

  // recent | price_asc | price_desc | surface
  @ApiPropertyOptional() @IsOptional() @IsString() sort?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() q?: string;
}
