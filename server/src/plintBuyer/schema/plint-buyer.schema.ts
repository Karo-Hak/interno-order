import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { PlintDebetKredit } from 'src/plint-debet-kredit/schema/plint-debet-kredit.schema';
import { PlintRetailOrder } from 'src/plint-order/schema/plint-retail-order.schema';
import { PlintWholesaleOrder } from 'src/plint-wholesale-order/schema/plint-wholesale-order.schema';

export type PlintBuyerDocument = HydratedDocument<PlintBuyer>;

/** ---- кредит (платежи от покупателя) ---- */
@Schema({ _id: false, versionKey: false })
export class PlintCreditItem {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String, trim: true })
  note?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}
export const PlintCreditItemSchema = SchemaFactory.createForClass(PlintCreditItem);

/** ---- покупка в РОЗНИЦУ ---- */
@Schema({ _id: false, versionKey: false })
export class PlintBuyRetailItem {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlintRetailOrder',
    required: true,
  })
  orderId: Types.ObjectId;
}
export const PlintBuyRetailItemSchema = SchemaFactory.createForClass(PlintBuyRetailItem);

/** ---- покупка в ОПТ ---- */
@Schema({ _id: false, versionKey: false })
export class PlintBuyWholesaleItem {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlintWholesaleOrder',
    required: true,
  })
  orderId: Types.ObjectId;
}
export const PlintBuyWholesaleItemSchema = SchemaFactory.createForClass(PlintBuyWholesaleItem);

/** ---- сам покупатель ---- */
@Schema({ timestamps: true, collection: 'plint_buyers', versionKey: false })
export class PlintBuyer {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ trim: true, index: true })
  phone1: string;

  @Prop({ trim: true })
  phone2: string;

  @Prop({ index: { unique: true, sparse: true } })
  phone1Norm?: string;

  @Prop({ index: { unique: true, sparse: true } })
  phone2Norm?: string;

  @Prop({ trim: true })
  region: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ type: Number, default: 0 })
  balanceAMD: number;

  // массив ссылок на retail заказы
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlintRetailOrder' }],
    default: [],
  })
  retailOrder: PlintRetailOrder[];

  // массив ссылок на wholesale заказы
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlintWholesaleOrder' }],
    default: [],
  })
  wholesaleOrder: PlintWholesaleOrder[];

  // общие DK-записи (и для retail, и для wholesale)
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlintDebetKredit' }],
    default: [],
  })
  debetKredit: PlintDebetKredit[];

  // платежи покупателя
  @Prop({ type: [PlintCreditItemSchema], default: [] })
  credit: PlintCreditItem[];

  // история покупок в розницу
  @Prop({ type: [PlintBuyRetailItemSchema], default: [] })
  buyRetail: PlintBuyRetailItem[];

  // история покупок оптом
  @Prop({ type: [PlintBuyWholesaleItemSchema], default: [] })
  buyWholesale: PlintBuyWholesaleItem[];
}

export const PlintBuyerSchema = SchemaFactory.createForClass(PlintBuyer);

// индексы для быстрого поиска по датам/заказам
PlintBuyerSchema.index({ 'credit.date': 1 });
PlintBuyerSchema.index({ 'buyRetail.date': 1 });
PlintBuyerSchema.index({ 'buyRetail.orderId': 1 });
PlintBuyerSchema.index({ 'buyWholesale.date': 1 });
PlintBuyerSchema.index({ 'buyWholesale.orderId': 1 });
PlintBuyerSchema.index({ phone1Norm: 1 }, { unique: true, sparse: true });
PlintBuyerSchema.index({ phone2Norm: 1 }, { unique: true, sparse: true });

