import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CoopCeilingOrder } from "src/coop-ceiling-order/schema/coop-ceiling-order.schema";
import { CoopStretchBuyer } from "src/coop-stretch-buyer/schema/coop-stretch-buyer.schema";
import { User } from "src/user/schema/user.schema";


export type CoopDebetKreditDocument = HydratedDocument<CoopDebetKredit>;

@Schema()
export class CoopDebetKredit {
    @Prop({ default: new Date() })
    date: Date;
    @Prop()
    type: string;
    @Prop()
    amount: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CoopStretchBuyer" })
    buyer: CoopStretchBuyer;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CoopCeilingOrder" })
    order: CoopCeilingOrder;
}

export const CoopDebetKreditSchema = SchemaFactory.createForClass(CoopDebetKredit)