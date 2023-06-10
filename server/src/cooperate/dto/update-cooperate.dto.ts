import { PartialType } from '@nestjs/mapped-types';
import { CreateCooperateDto } from './create-cooperate.dto';

export class UpdateCooperateDto extends PartialType(CreateCooperateDto) {}
