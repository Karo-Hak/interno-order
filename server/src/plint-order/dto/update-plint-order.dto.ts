import { PartialType } from '@nestjs/mapped-types';
import { CreatePlintOrderDto } from './create-plint-order.dto';
import { PlintOrder } from '../schema/plint-order.schema';

export class UpdatePlintOrderDto extends PartialType(CreatePlintOrderDto) {
  coop: string;
  plintOrder: PlintOrder;
  buyer: any;
  user: any;
}
