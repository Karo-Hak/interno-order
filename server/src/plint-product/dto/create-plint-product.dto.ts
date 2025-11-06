import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreatePlintProductDto {
  @IsString()
  name: string;

  @IsInt() @Min(0)
  retailPriceAMD: number;

  @IsInt() @Min(0)
  wholesalePriceAMD: number;

  @IsInt() @Min(0)
  stockBalance: number;

  @IsOptional() @IsBoolean()
  isActive?: boolean;
}
