import { PartialType } from '@nestjs/mapped-types';
import { CreateStretchBuyerDto } from './create-stretch-buyer.dto';

export class UpdateStretchBuyerDto extends PartialType(CreateStretchBuyerDto) {}
