import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateListingDto {
  @ApiProperty() @IsString() title: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;

  @ApiProperty({ enum: TransactionType, default: TransactionType.SALE })
  @IsEnum(TransactionType)
  transaction: TransactionType;

  @ApiProperty({ example: 1250000 }) @IsNumber() @Min(0) price: number;

  @ApiProperty({ default: 'MAD' }) @IsString() currencyCode: string;

  @ApiProperty() @IsInt() typeId: number;
  @ApiProperty() @IsInt() countryId: number;
  @ApiProperty() @IsInt() regionId: number;
  @ApiProperty() @IsInt() cityId: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() neighborhoodId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() lat?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() lng?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() surface?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() landSurface?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() bedrooms?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() bathrooms?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() floors?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() parking?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() elevator?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() terrace?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() garden?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() pool?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() seaView?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() furnished?: boolean;

  @ApiProperty({ required: false, type: [Number], description: 'Étiquettes (ids)' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  labelIds?: number[];

  @ApiProperty({ required: false, description: 'URL de la vidéo' })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ required: false, type: [Object], description: 'Images (url + isPrimary)' })
  @IsOptional()
  @IsArray()
  images?: { url: string; isPrimary?: boolean; alt?: string }[];
}
