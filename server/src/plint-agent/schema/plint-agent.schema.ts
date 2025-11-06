import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { PlintAgentDebetKredit } from 'src/plint-agent-debet-kredit/schema/plint-agent-debet-kredit.schema';
import { PlintWholesaleOrder } from 'src/plint-wholesale-order/schema/plint-wholesale-order.schema';

export type PlintAgentDocument = HydratedDocument<PlintAgent>;

@Schema({ _id: false, versionKey: false })
export class PlintAgentCreditItem {
  @Prop({ type: Date, required: true }) date: Date;
  @Prop({ type: Number, required: true, min: 0 }) amount: number;
  @Prop({ type: String, trim: true }) note?: string;
  @Prop({ type: Types.ObjectId, ref: 'User' }) createdBy?: Types.ObjectId;
}
export const PlintAgentCreditItemSchema = SchemaFactory.createForClass(PlintAgentCreditItem);

@Schema({ _id: false, versionKey: false })
export class PlintAgentBuyItem {
  @Prop({ type: Date, required: true }) date: Date;
  @Prop({ type: Number, required: true, min: 0 }) amount: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PlintWholesaleOrder', required: true })
  orderId: Types.ObjectId;
}
export const PlintAgentBuyItemSchema = SchemaFactory.createForClass(PlintAgentBuyItem);

@Schema({ timestamps: true, collection: 'plint_Agents', versionKey: false })
export class PlintAgent {
  @Prop({ required: true, trim: true, index: true }) name: string;
  @Prop({ trim: true, index: true }) phone1: string;
  @Prop({ trim: true }) phone2: string;
  @Prop({ index: { unique: true, sparse: true } }) phone1Norm?: string;
  @Prop({ index: { unique: true, sparse: true } }) phone2Norm?: string;
  @Prop({ trim: true }) region: string;
  @Prop({ trim: true }) address: string;

  @Prop({ type: Number, default: 0 }) balanceAMD: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlintWholesaleOrder' }], default: [] })
  wholesaleOrder: PlintWholesaleOrder[];

  // ✅ массив ссылок на агентскую DK-модель
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlintAgentDebetKredit' }], default: [] })
  debetKredit: PlintAgentDebetKredit[];

  @Prop({ type: [PlintAgentCreditItemSchema], default: [] })
  credit: PlintAgentCreditItem[];

  @Prop({ type: [PlintAgentBuyItemSchema], default: [] })
  buy: PlintAgentBuyItem[];
}

export const PlintAgentSchema = SchemaFactory.createForClass(PlintAgent);

PlintAgentSchema.index({ 'credit.date': 1 });
PlintAgentSchema.index({ 'buy.date': 1 });
PlintAgentSchema.index({ 'buy.orderId': 1 });
