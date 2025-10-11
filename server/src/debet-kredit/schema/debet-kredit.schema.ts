import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { StretchBuyer } from "src/stretch-buyer/schema/stretch-buyer.schema";
import { StretchCeilingOrder } from "src/stretch-ceiling-order/schema/stretch-ceiling-order.schema";
import { User } from "src/user/schema/user.schema";


export type DebetKreditDocument = HydratedDocument<DebetKredit>;

@Schema()
export class DebetKredit {
  @Prop({ type: Date, default: () => new Date() })
  date: Date;
    @Prop()
    type: string;
    @Prop()
    amount: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "StretchBuyer" })
    buyer: StretchBuyer;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "StretchCeilingOrder" })
    order: StretchCeilingOrder;
}

export const DebetKreditSchema = SchemaFactory.createForClass(DebetKredit)