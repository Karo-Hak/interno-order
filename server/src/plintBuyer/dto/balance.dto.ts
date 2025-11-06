import { IsNumber } from 'class-validator';

export class AdjustBalanceDto {
  @IsNumber()
  deltaAMD: number; // может быть +/-
}

export class SetBalanceDto {
  @IsNumber()
  valueAMD: number;
}
