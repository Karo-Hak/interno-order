import { IsArray, ValidateNested, IsOptional, IsISO8601, IsMongoId, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class BuyItemDto {
  @IsMongoId()
  productId!: string;

  @IsNumber()
  @Min(0.0001)
  qty!: number;
}

export class BuyProductDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BuyItemDto)
  items!: BuyItemDto[];

  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  note?: string;
}
