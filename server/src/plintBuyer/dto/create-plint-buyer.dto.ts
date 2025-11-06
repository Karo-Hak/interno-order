import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePlintBuyerDto {
  @IsString() @Length(1, 200)
  name: string;

  @IsOptional() @IsString()
  phone1?: string;

  @IsOptional() @IsString()
  phone2?: string;

  @IsOptional() @IsString()
  region?: string;

  @IsOptional() @IsString()
  address?: string;
}
