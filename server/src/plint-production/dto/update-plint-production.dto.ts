import { PartialType } from '@nestjs/mapped-types';
import { CreatePlintProductionDto } from './create-plint-production.dto';

export class UpdatePlintProductionDto extends PartialType(CreatePlintProductionDto) {}
