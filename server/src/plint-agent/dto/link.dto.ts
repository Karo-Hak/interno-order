import { IsMongoId } from 'class-validator';

export class LinkOrderDto {
  @IsMongoId()
  orderId: string;
}

export class LinkAgentDebetKreditDto {
  @IsMongoId()
  dkId: string;
}
