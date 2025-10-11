// coop-credit.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CoopCeilingOrder } from "src/coop-ceiling-order/schema/coop-ceiling-order.schema";
import { CoopStretchBuyer } from "src/coop-stretch-buyer/schema/coop-stretch-buyer.schema";
import { User } from "src/user/schema/user.schema";

export type CoopCreditDocument = HydratedDocument<CoopCredit>;

@Schema({ _id: false })
export class CreditEntry {
  @Prop({ type: Date, default: () => new Date() })
  date: Date;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;
}
export const CreditEntrySchema = SchemaFactory.createForClass(CreditEntry);

@Schema({ _id: false })
export class BuyEntry {
  @Prop({ type: Date, default: () => new Date() })
  date: Date;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  // Покупка может быть связана с заказом (опционально)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CoopCeilingOrder", required: false })
  order?: CoopCeilingOrder;
}
export const BuyEntrySchema = SchemaFactory.createForClass(BuyEntry);

@Schema({ timestamps: true })
export class CoopCredit {
  @Prop({ type: Date, default: () => new Date() })
  date: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CoopStretchBuyer", required: true, index: true })
  coop: CoopStretchBuyer;

  // Все уникальные ID заказов, фигурировавших в покупках
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "CoopCeilingOrder", default: [], index: true })
  orders: CoopCeilingOrder[];

  // Платежи клиента (без привязки к заказу)
  @Prop({ type: [CreditEntrySchema], default: [] })
  credit: CreditEntry[];

  // Покупки клиента (возможно с привязкой к заказу)
  @Prop({ type: [BuyEntrySchema], default: [] })
  buy: BuyEntry[];

  // Итог = сумма(buy) - сумма(credit)
  @Prop({ type: Number, default: 0 })
  balance: number;
  
}

export const CoopCreditSchema = SchemaFactory.createForClass(CoopCredit);
