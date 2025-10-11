// update-coop-ceiling-order.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

class TextureItemDto {
  @IsString() name: string;
  @IsNumber() @Min(0) height: number;
  @IsNumber() @Min(0) width: number;
  @IsOptional() @IsNumber() @Min(0) sq?: number;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsNumber() @Min(0) sum?: number;
}

class SimpleItemDto {
  @IsString() name: string;
  @IsNumber() @Min(0) qty: number;
  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsNumber() @Min(0) sum?: number;
}

export class UpdateCoopOrderDto {
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => TextureItemDto)
  groupedStretchTextureData?: TextureItemDto[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SimpleItemDto)
  groupedStretchProfilData?: SimpleItemDto[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SimpleItemDto)
  groupedLightPlatformData?: SimpleItemDto[];

  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SimpleItemDto)
  groupedLightRingData?: SimpleItemDto[];

  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() buyerComment?: string;
  @IsOptional() @IsNumber() @Min(0) balance?: number;

  @IsOptional()
  @IsEnum(['cash', 'card', 'transfer', 'other'] as const)
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'other';

  @IsOptional() @IsArray()
  picUrl?: string[];

  @IsOptional() @IsMongoId()
  buyerId?: string;

  @IsOptional() @IsMongoId()
  userId?: string;
}
