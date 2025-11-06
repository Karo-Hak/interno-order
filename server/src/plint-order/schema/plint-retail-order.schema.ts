// src/plint-order/schema/plint-retail-order.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { PlintBuyer } from 'src/plintBuyer/schema/plint-buyer.schema';
import { User } from 'src/user/schema/user.schema';

export type PlintRetailOrderDocument = HydratedDocument<PlintRetailOrder>;

/** ---- сабдок для позиции ---- */
@Schema({ _id: false, versionKey: false })
export class RetailItem {
  @Prop({ type: String, trim: true }) name?: string;
  @Prop({ type: String, trim: true }) sku?: string;
  @Prop({ type: Number, required: true, min: 0 }) qty!: number;
  @Prop({ type: Number, required: true, min: 0 }) price!: number;
  @Prop({ type: Number, required: true, min: 0 }) sum!: number; // qty * price
}
export const RetailItemSchema = SchemaFactory.createForClass(RetailItem);

/** ---- корневая схема ---- */
@Schema({ timestamps: true, versionKey: false, collection: 'plint_retail_orders' })
export class PlintRetailOrder {
  
  @Prop({ type: [RetailItemSchema], default: [] })
  items: RetailItem[];

  @Prop({ type: Date, default: () => new Date(), index: true })
  date: Date;

  @Prop({ type: String, trim: true })
  buyerComment: string;

  @Prop({ type: Number, required: true, min: 0 })
  totalSum: number;

  @Prop({ type: Number, required: true, min: 0 })
  balance: number;

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
}

export const PlintRetailOrderSchema = SchemaFactory.createForClass(PlintRetailOrder);
PlintRetailOrderSchema.index({ buyer: 1, date: -1 });

PlintRetailOrderSchema.index({ date: -1, status: 1 });
PlintRetailOrderSchema.index({ buyer: 1, date: -1 });