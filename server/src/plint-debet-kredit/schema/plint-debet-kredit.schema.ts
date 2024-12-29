import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PlintOrder } from "src/plint-order/schema/plint-order.schema";
import { PlintBuyer } from "src/plintBuyer/schema/plint-buyer.schema";
import { User } from "src/user/schema/user.schema";


export type PlintDebetKreditDocument = HydratedDocument<PlintDebetKredit>;

@Schema()
export class PlintDebetKredit {
    @Prop({ default: new Date() })
    date: Date;
    @Prop()
    type: string;
    @Prop()
    amount: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "PlintBuyer" })
    buyer: PlintBuyer;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "PlintOrder" })
    order: PlintOrder;
}

export const PlintDebetKreditSchema = SchemaFactory.createForClass(PlintDebetKredit)