import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PlintProduct } from 'src/plint-product/schema/plint-product.schema';
import { User } from 'src/user/schema/user.schema';

export type PlintProductionDocument = HydratedDocument<PlintProduction>;

@Schema({ timestamps: true, collection: 'plint_productions' })
export class PlintProduction {
  @Prop({ type: Date, default: () => new Date() })
  date: Date;

  @Prop()
  name: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PlintProduct', required: true })
  plint: PlintProduct;
}

export const PlintProductionSchema = SchemaFactory.createForClass(PlintProduction);
