import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CoopCeilingOrder } from "src/coop-ceiling-order/schema/coop-ceiling-order.schema";
import { CoopStretchBuyer } from "src/coop-stretch-buyer/schema/coop-stretch-buyer.schema";
import { User } from "src/user/schema/user.schema";

export type CoopDebetKreditDocument = HydratedDocument<CoopDebetKredit>;

@Schema({ timestamps: true })
export class CoopDebetKredit {
  @Prop({ type: Date, default: () => new Date() })
  date: Date;

  @Prop({ required: true, trim: true })
  type: string; // "Գնում" | "Վճարում" | "Վերադարձ" | ...

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CoopStretchBuyer", required: true })
  buyer: CoopStretchBuyer;

  // ❗️Делаем НЕобязательным — иногда проводки без конкретного заказа (например, аванс/возврат)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CoopCeilingOrder", required: false, default: null })
  order?: CoopCeilingOrder | null;
}

export const CoopDebetKreditSchema = SchemaFactory.createForClass(CoopDebetKredit);
