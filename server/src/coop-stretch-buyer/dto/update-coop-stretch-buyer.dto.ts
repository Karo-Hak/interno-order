import { PartialType } from '@nestjs/mapped-types';
import { CreateCoopStretchBuyerDto } from './create-coop-stretch-buyer.dto';

export class UpdateCoopStretchBuyerDto extends PartialType(CreateCoopStretchBuyerDto) {}
