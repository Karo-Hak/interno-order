import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(0)
  coopPrice!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @IsMongoId()
  categoryProduct!: string;
}
