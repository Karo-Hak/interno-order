import { IsMongoId } from 'class-validator';

export class LinkOrderDto {
  @IsMongoId()
  orderId: string;
}

export class LinkDebetKreditDto {
  @IsMongoId()
  dkId: string;
}
