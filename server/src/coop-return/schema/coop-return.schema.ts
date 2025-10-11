import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { CoopStretchBuyer } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { CoopCeilingOrder } from 'src/coop-ceiling-order/schema/coop-ceiling-order.schema';
import { User } from 'src/user/schema/user.schema';

export type CoopReturnDocument = HydratedDocument<CoopReturn>;

@Schema({ _id: false })
class GroupedItem {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ type: Number, min: 0, default: 0 }) width?: number;
  @Prop({ type: Number, min: 0, default: 0 }) height?: number;
  @Prop({ type: Number, min: 0, default: 0 }) qty: number;
  @Prop({ type: Number, min: 0, default: 0 }) price: number;
  @Prop({ type: Number, min: 0, default: 0 }) sum: number;
}
const GroupedItemSchema = SchemaFactory.createForClass(GroupedItem);

@Schema({ timestamps: true, versionKey: false })
export class CoopReturn {
  @Prop({ type: [GroupedItemSchema], default: [] }) groupedStretchTextureData: GroupedItem[];
  @Prop({ type: [GroupedItemSchema], default: [] }) groupedStretchProfilData: GroupedItem[];
  @Prop({ type: [GroupedItemSchema], default: [] }) groupedLightPlatformData: GroupedItem[];
  @Prop({ type: [GroupedItemSchema], default: [] }) groupedLightRingData: GroupedItem[];

  @Prop({ type: Date, default: () => new Date() }) date: Date;
  @Prop({ trim: true, default: '' }) reason: string;
  @Prop({ trim: true, default: '' }) comment: string;
  @Prop({ type: [String], default: [] }) picUrl: string[];

  @Prop({ type: Number, min: 0, default: 0 }) amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CoopStretchBuyer.name, required: true })
  buyer: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CoopCeilingOrder.name })
  order?: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CoopDebetKredit' })
  dkId?: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const CoopReturnSchema = SchemaFactory.createForClass(CoopReturn);
CoopReturnSchema.index({ date: -1 });
CoopReturnSchema.index({ buyer: 1, date: -1 });
