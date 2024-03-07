import { PartialType } from '@nestjs/mapped-types';
import { CreateStretchCeilingOrderDto } from './create-stretch-ceiling-order.dto';

export class UpdateStretchCeilingOrderDto extends PartialType(CreateStretchCeilingOrderDto) {
    buyer:any;
    stretchTextureOrder:any
}
