import { PartialType } from '@nestjs/mapped-types';
import { CreateCoopCeilingOrderDto } from './create-coop-ceiling-order.dto';

export class UpdateCoopCeilingOrderDto extends PartialType(CreateCoopCeilingOrderDto) {}
