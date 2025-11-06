import { PartialType } from '@nestjs/mapped-types';
import { CreatePlintRetailOrderDto } from './create-plint-retail-order.dto';

export class UpdatePlintRetailOrderDto extends PartialType(CreatePlintRetailOrderDto) {}
