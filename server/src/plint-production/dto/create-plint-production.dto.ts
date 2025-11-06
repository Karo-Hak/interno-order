import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlintProductionDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsNumber()
  readonly quantity: number;

  @IsMongoId()
  @IsNotEmpty()
  readonly plint: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly user: string;

  @IsOptional()
  readonly date?: Date;
}
