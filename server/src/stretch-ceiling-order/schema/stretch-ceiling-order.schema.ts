import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { StretchBuyer } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { StretchWorker } from 'src/stretch-worker/schema/stretch-worker.schema';
import { User } from 'src/user/schema/user.schema';

export type StretchCeilingOrderDocument = HydratedDocument<StretchCeilingOrder>;

@Schema({ timestamps: false }) // вручную контролируем даты
export class StretchCeilingOrder {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  rooms: any;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  groupedWorks: Record<string, any>;

  @Prop({ type: Date, default: () => new Date() })
  date: Date;

  @Prop() buyerComment: string;
  @Prop() address: string;
  @Prop() region: string;

  @Prop({ type: Number, default: 0 }) balance: number;
  @Prop({ type: Number, default: 0 }) prepayment: number;
  @Prop({ type: Number, default: 0 }) groundTotal: number;

  @Prop() orderComment: string;
  @Prop() paymentMethod: string;

  // ✅ если не пришло — ставим текущую дату
  @Prop({
    type: Date,
    default: () => new Date(),
    set: (v: any) => (v ? new Date(v) : new Date()),
  })
  measureDate: Date;

  // ✅ то же самое
  @Prop({
    type: Date,
    default: () => new Date(),
    set: (v: any) => (v ? new Date(v) : new Date()),
  })
  installDate: Date;

  @Prop({ default: 'progress' }) status: string;
  @Prop() code: string;

  @Prop({ type: Number, default: 0 }) salary: number;
  @Prop({ type: Number, default: 0 }) roomSum: number;

  @Prop({ default: false }) payed: boolean;
  @Prop({ type: [String], default: [] }) picUrl: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'StretchWorker', default: null })
  stWorker: StretchWorker | Types.ObjectId | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'StretchBuyer', required: true })
  buyer: Types.ObjectId | StretchBuyer;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;
}

export const StretchCeilingOrderSchema = SchemaFactory.createForClass(StretchCeilingOrder);

StretchCeilingOrderSchema.index({ status: 1, date: -1 });
StretchCeilingOrderSchema.index({ installDate: 1 });
StretchCeilingOrderSchema.index({ buyer: 1 });
