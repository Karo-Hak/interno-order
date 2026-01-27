// src/coop-stretch-buyer/schema/coop-stretch-buyer.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { CoopCeilingOrder } from 'src/coop-ceiling-order/schema/coop-ceiling-order.schema';

export type CoopStretchBuyerDocument = HydratedDocument<CoopStretchBuyer>;

export type CreditEntryType = 'payment' | 'return' | 'returnPayment';

export interface CreditEntry {
  date: Date;
  sum: number;
  /** quoted to avoid tooling collisions */
  ["type"]: CreditEntryType;
  dkId?: Types.ObjectId | null;
  returnId?: Types.ObjectId | null;
}

@Schema()
export class CoopStretchBuyer {
  @Prop() name: string;
  @Prop() phone1: string;
  @Prop() phone2: string;
  @Prop() region: string;
  @Prop() address: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoopCeilingOrder' }],
    default: [],
  })
  order: CoopCeilingOrder[];

  /** Ссылки на документы возвратов */
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoopReturn' }],
    default: [],
  })
  returns: Types.ObjectId[];

  /**
   * Кредит-лента: платежи и возвраты
   * - type: 'payment' | 'return' | 'returnPayment'
   * - dkId: ссылка на DK (для платежа)
   * - returnId: ссылка на документ возврата (для возврата)
   */
  @Prop({
    type: [{
      _id: false,
      date:   { type: Date,   required: true },
      sum:    { type: Number, required: true, min: 0 },
      type:   { type: String, enum: ['payment', 'return', 'returnPayment'], required: true },
      dkId:     { type: mongoose.Schema.Types.ObjectId, ref: 'CoopDebetKredit', default: null },
      returnId: { type: mongoose.Schema.Types.ObjectId, ref: 'CoopReturn',      default: null },
    }],
    default: [],
  })
  credit: CreditEntry[];

  /** Покупки (увеличивают долг) */
  @Prop({
    type: [{
      _id: false,
      date: { type: Date, required: true },
      sum:  { type: Number, required: true, min: 0 },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CoopCeilingOrder',
        required: true,
      },
    }],
    default: [],
  })
  buy: { date: Date; sum: number; orderId: mongoose.Types.ObjectId }[];

  /** Текущий долг (может быть отрицательным, если переплата) */
  @Prop({ type: Number, default: 0 })
  totalSum: number;

  /** Ссылки на DK-проводки */
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoopDebetKredit' }], default: [] })
  debetKredit: Types.ObjectId[];
}

export const CoopStretchBuyerSchema = SchemaFactory.createForClass(CoopStretchBuyer);
