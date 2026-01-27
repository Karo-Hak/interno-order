import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStretchBuyerDto {
  // На фронте phone, а в схеме поле buyerPhone1.
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  buyerName: string;
}
