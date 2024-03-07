import { PartialType } from '@nestjs/mapped-types';
import { CreateStretchWorkDto } from './create-stretch-work.dto';

export class UpdateStretchWorkDto extends PartialType(CreateStretchWorkDto) {}
