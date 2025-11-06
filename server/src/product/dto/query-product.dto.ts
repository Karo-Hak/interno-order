import { IsMongoId, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductDto {
  @IsMongoId()
  categoryId: string;

  @IsOptional() @IsString()
  q?: string;

  @IsOptional() @IsInt() @Type(() => Number) @Min(0)
  skip?: number = 0;

  @IsOptional() @IsInt() @Type(() => Number) @Min(1)
  limit?: number = 50;

  @IsOptional() @IsString()
  sort?: 'name' | 'price' | 'coopPrice' | 'quantity' = 'name';
}
