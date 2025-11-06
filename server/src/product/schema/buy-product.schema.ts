import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from './product.schema';

@Schema({ _id: false })
export class BuyProductItem {
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  product!: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0 })
  qty!: number;
}
export const BuyProductItemSchema = SchemaFactory.createForClass(BuyProductItem);

export type BuyProductDocument = HydratedDocument<BuyProduct>;

@Schema({ timestamps: true })
export class BuyProduct {
  @Prop({ type: Date, required: true })
  date!: Date;

  @Prop({ type: [BuyProductItemSchema], default: [], required: true })
  items!: BuyProductItem[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ type: String })
  note?: string;
}
export const BuyProductSchema = SchemaFactory.createForClass(BuyProduct);
