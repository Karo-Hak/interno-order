import { PartialType } from '@nestjs/mapped-types';
import { CreateStretchBuyerDto } from './create-stretch-buyer.dto';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateStretchBuyerDto extends PartialType(CreateStretchBuyerDto) {
  @IsMongoId()
  @IsString()
  _id: string;

  // Прочие поля можно обновлять частично (как раньше)
  @IsOptional()
  phone?: string;

  @IsOptional()
  buyerName?: string;
}
