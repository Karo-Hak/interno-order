import { PartialType } from '@nestjs/mapped-types';
import { CreatePlintBuyerDto } from './create-plint-buyer.dto';

export class UpdatePlintBuyerDto extends PartialType(CreatePlintBuyerDto) {
    _id:string
}
