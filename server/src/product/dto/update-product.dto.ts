import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsMongoId()
  _id!: string;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  coopPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsMongoId()
  categoryProduct?: string;
}
