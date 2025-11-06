import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { PlintAgent, PlintAgentSchema } from 'src/plint-agent/schema/plint-agent.schema';
import { PlintBuyer } from 'src/plintBuyer/schema/plint-buyer.schema';
import { User } from 'src/user/schema/user.schema';

export type PlintWholesaleOrderDocument = HydratedDocument<PlintWholesaleOrder>;

/** ---- сабдок для позиции ---- */
@Schema({ _id: false, versionKey: false })
export class WholesaleItem {
  @Prop({ type: String, trim: true }) name?: string;
  @Prop({ type: String, trim: true }) sku?: string;
  @Prop({ type: Number, required: true, min: 0 }) qty!: number;
  @Prop({ type: Number, required: true, min: 0 }) price!: number;
  @Prop({ type: Number, required: true, min: 0 }) sum!: number; // qty * price
}
export const WholesaleItemSchema = SchemaFactory.createForClass(WholesaleItem);

@Schema({ timestamps: true, versionKey: false, collection: 'plint_wholesale_orders' })
export class PlintWholesaleOrder {
  @Prop({ type: [WholesaleItemSchema], default: [] })
  items: WholesaleItem[];

  @Prop({ type: Date, default: () => new Date(), index: true })
  date: Date;

  @Prop({ type: String, trim: true })
  buyerComment: string;

  @Prop({ type: Number, required: true, min: 0 })
  totalSum: number;

  @Prop({ type: Number, required: true, min: 0 })
  balance: number;

  @Prop({ type: Number, min: 0, default: null })
  agentDiscount?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  agentSum?: number | null;

  @Prop({ type: String, trim: true })
  deliveryAddress: string;

  @Prop({ type: String, trim: true })
  deliveryPhone: string;

  @Prop({ type: Boolean, default: false })
  delivery: boolean;

  @Prop({ type: Number, default: 0, min: 0 })
  deliverySum: number;

  @Prop({ type: String, trim: true })
  paymentMethod: string;

  @Prop({ type: Boolean, default: false })
  done: boolean;

  @Prop({ type: String, enum: ['active', 'canceled', 'closed'], default: 'active', index: true })
  status: 'active' | 'canceled' | 'closed';

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PlintBuyer', required: true, index: true })
  buyer: PlintBuyer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PlintAgent', required: false, default: null, index: true })
  agent?: PlintAgent | null;
}

export const PlintWholesaleOrderSchema = SchemaFactory.createForClass(PlintWholesaleOrder);

PlintWholesaleOrderSchema.index({ buyer: 1, date: -1 });
PlintWholesaleOrderSchema.index({ date: -1, status: 1 });
PlintAgentSchema.index({ buyer: 1, date: -1 });