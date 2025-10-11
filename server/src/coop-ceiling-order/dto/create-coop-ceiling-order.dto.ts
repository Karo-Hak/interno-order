import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class TextureItemDto {
  @IsString() name: string;

  @IsNumber() @Min(0) height: number;
  @IsNumber() @Min(0) width: number;

  // sq и sum можем принимать опционально — сервер при сохранении досчитает
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

export class BuyerInputDto {
  @IsOptional() @IsMongoId() buyerId?: string;

  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone1?: string;
  @IsOptional() @IsString() phone2?: string;
  @IsOptional() @IsString() region?: string;
  @IsOptional() @IsString() address?: string;
}

export class StretchTextureOrderDto {
  // 👉 Только текстуры используют height/width/sq
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => TextureItemDto)
  groupedStretchTextureData?: TextureItemDto[];

  // 👉 Простые группы не требуют height/width
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
}

export class CreateCoopOrderDto {
  @ValidateNested() @Type(() => StretchTextureOrderDto)
  stretchTextureOrder: StretchTextureOrderDto;

  @ValidateNested() @Type(() => BuyerInputDto)
  buyer: BuyerInputDto;

  @IsMongoId()
  userId: string;
}

export class DateFilterDto {
  @IsDateString() startDate: string;
  @IsDateString() endDate: string;
}
