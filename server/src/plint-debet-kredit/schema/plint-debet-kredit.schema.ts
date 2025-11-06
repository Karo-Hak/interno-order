import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PlintRetailOrder } from 'src/plint-order/schema/plint-retail-order.schema';
import { PlintBuyer } from 'src/plintBuyer/schema/plint-buyer.schema';
import { User } from 'src/user/schema/user.schema';

export type PlintDebetKreditDocument = HydratedDocument<PlintDebetKredit>;

@Schema({ timestamps: true, collection: 'plint_debetKredit' })
export class PlintDebetKredit {
  @Prop({ type: Date, default: () => new Date() }) date: Date;
  @Prop({ required: true, trim: true }) type: string; // "Գնում" | "Վճարում"
  @Prop({ type: Number, required: true, min: 0 }) amount: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }) user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PlintBuyer', required: true }) buyer: PlintBuyer;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PlintRetailOrder', required: false, default: null })
  order?: PlintRetailOrder | null;
}

export const PlintDebetKreditSchema = SchemaFactory.createForClass(PlintDebetKredit);

PlintDebetKreditSchema.index({ order: 1, date: -1, _id: -1 });
PlintDebetKreditSchema.index({ buyer: 1, date: -1, _id: -1 });
PlintDebetKreditSchema.index({ type: 1 });
