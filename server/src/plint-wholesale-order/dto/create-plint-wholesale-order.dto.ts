import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, ValidateNested, IsMongoId, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class ManualBuyerDto {
  @IsString() name: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
}

class WholesaleItemDto {
  @IsOptional() @IsMongoId() productId?: string; // допускаем отсутствие id
  @IsString() name: string;
  @IsOptional() @IsString() sku?: string;
  @IsNumber() qty: number;
  @IsNumber() price: number;
  @IsNumber() sum: number;
}

export class CreatePlintWholesaleOrderDto {
  @IsDateString() date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WholesaleItemDto)
  items: WholesaleItemDto[];

  @IsBoolean() delivery: boolean;
  @IsOptional() @IsString() deliveryAddress?: string;
  @IsOptional() @IsString() deliveryPhone?: string;
  @IsOptional() @IsNumber() deliverySum?: number;

  // ⬇️ агент и его поля — все опциональны
  @IsOptional() @IsNumber() agentDiscount?: number;
  @IsOptional() @IsNumber() agentSum?: number;
  @IsOptional() @IsMongoId() agent?: string;

  @IsString() paymentMethod: string;
  @IsOptional() @IsString() buyerComment?: string;

  @IsOptional() @IsMongoId() buyer?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ManualBuyerDto)
  manualBuyer?: ManualBuyerDto;

  @IsOptional() @IsMongoId() userId?: string;
}
