import { PartialType } from '@nestjs/mapped-types';
import { CreatePlintWholesaleOrderDto } from './create-plint-wholesale-order.dto';

export class UpdatePlintWholesaleOrderDto extends PartialType(CreatePlintWholesaleOrderDto) {}
