import { PartialType } from '@nestjs/mapped-types';
import { CreateLightRingDto } from './create-light-ring.dto';

export class UpdateLightRingDto extends PartialType(CreateLightRingDto) {}
