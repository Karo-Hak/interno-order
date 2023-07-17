import { PartialType } from '@nestjs/mapped-types';
import { CreateUnytDto } from './create-unyt.dto';

export class UpdateUnytDto extends PartialType(CreateUnytDto) {}
