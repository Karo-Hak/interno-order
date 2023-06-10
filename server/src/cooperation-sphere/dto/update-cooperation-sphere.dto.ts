import { PartialType } from '@nestjs/mapped-types';
import { CreateCooperationSphereDto } from './create-cooperation-sphere.dto';

export class UpdateCooperationSphereDto extends PartialType(CreateCooperationSphereDto) {}
