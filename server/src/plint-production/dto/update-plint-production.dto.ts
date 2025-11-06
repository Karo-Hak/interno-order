import { PartialType } from '@nestjs/swagger';
import { CreatePlintProductionDto } from './create-plint-production.dto';
import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdatePlintProductionDto extends PartialType(CreatePlintProductionDto) {
  @IsOptional() @IsInt() @Min(1)
  quantity?: number;
}
