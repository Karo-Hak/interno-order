import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, ValidateNested, IsMongoId, IsArray, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class ManualBuyerDto {
  @IsString() name: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
}

class RetailItemDto {
  @IsOptional() @IsMongoId() productId?: string; // допускаем отсутствие id
  @IsString() name: string;
  @IsOptional() @IsString() sku?: string;
  @IsNumber() qty: number;
  @IsNumber() price: number;
  @IsNumber() sum: number;
}

export class CreatePlintRetailOrderDto {
  @IsDateString() date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RetailItemDto)
  items: RetailItemDto[];

  @IsBoolean() delivery: boolean;
  @IsOptional() @IsString() deliveryAddress?: string;
  @IsOptional() @IsString() deliveryPhone?: string;
  @IsOptional() @IsNumber() deliverySum?: number;

  @IsString() paymentMethod: string;
  @IsOptional() @IsString() buyerComment?: string;

  @IsOptional() @IsMongoId() buyer?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ManualBuyerDto)
  manualBuyer?: ManualBuyerDto;

  @IsOptional()
  @IsMongoId()
  userId?: string;
}
