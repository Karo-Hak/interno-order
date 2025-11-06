import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { CoopStretchBuyer } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';

export type CoopCeilingOrderDocument = HydratedDocument<CoopCeilingOrder>;

@Schema({ _id: false })
class TextureItem {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ type: Number, min: 0, default: 0 }) width?: number;
  @Prop({ type: Number, min: 0, default: 0 }) height?: number;
  @Prop({ type: Number, min: 0, default: 0 }) qty: number;
  @Prop({ type: Number, min: 0, default: 0 }) price: number;
  @Prop({ type: Number, min: 0, default: 0 }) sum: number;
}
const TextureItemSchema = SchemaFactory.createForClass(TextureItem);

@Schema({ _id: false })
class GroupedItem {
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ type: Number, min: 0, default: 0 }) qty: number;
  @Prop({ type: Number, min: 0, default: 0 }) price: number;
  @Prop({ type: Number, min: 0, default: 0 }) sum: number;
}
const GroupedItemSchema = SchemaFactory.createForClass(GroupedItem);

type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';

@Schema({ timestamps: true, versionKey: false })
export class CoopCeilingOrder {
  @Prop({ type: [TextureItemSchema], default: [] })
  groupedStretchTextureData: TextureItem[];

  @Prop({ type: [GroupedItemSchema], default: [] })
  groupedStretchProfilData: GroupedItem[];

  @Prop({ type: [GroupedItemSchema], default: [] })
  groupedLightPlatformData: GroupedItem[];

  @Prop({ type: [GroupedItemSchema], default: [] })
  groupedLightRingData: GroupedItem[];

  @Prop({ type: Date, default: () => new Date() })
  date: Date;

  @Prop({ trim: true, default: '' })
  buyerComment: string;

  @Prop({ type: Number, min: 0, default: 0 })
  balance: number;

  @Prop({ type: String, enum: ['cash', 'card', 'transfer', 'other'], default: 'cash' })
  paymentMethod: PaymentMethod;

  @Prop({ type: [String], default: [] })
  picUrl: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: CoopStretchBuyer.name, required: true })
  buyer: Types.ObjectId;

  // Просто храним ссылку на пользователя (валидность можно проверять в доменной логике)
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  user: Types.ObjectId;
}

export const CoopCeilingOrderSchema = SchemaFactory.createForClass(CoopCeilingOrder);

// Индексы
CoopCeilingOrderSchema.index({ date: -1 });
CoopCeilingOrderSchema.index({ buyer: 1, date: -1 });
