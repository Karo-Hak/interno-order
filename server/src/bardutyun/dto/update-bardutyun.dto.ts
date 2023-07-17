import { PartialType } from '@nestjs/mapped-types';
import { CreateBardutyunDto } from './create-bardutyun.dto';

export class UpdateBardutyunDto extends PartialType(CreateBardutyunDto) {}
