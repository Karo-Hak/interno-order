import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlintProductDocument = HydratedDocument<PlintProduct>;

@Schema({ timestamps: true, collection: 'plint_products', versionKey: false })
export class PlintProduct {
  @Prop({ required: true, trim: true, unique: true, index: true })
  name: string;

  @Prop({ required: true, min: 0 })
  retailPriceAMD: number;

  @Prop({ required: true, min: 0 })
  wholesalePriceAMD: number;

  @Prop({ required: true, min: 0, default: 0 })
  stockBalance: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const PlintProductSchema = SchemaFactory.createForClass(PlintProduct);
