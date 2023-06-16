import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Buyer } from "src/buyer/schema/buyer.schema";
import { Cooperate } from "src/cooperate/schema/cooperate.schema";
import { Texture } from "src/texture/schema/texture.schema";
import { User } from "src/user/schema/user.schema";

export type OrderDocument = HydratedDocument<Order>

@Schema()
export class Order {
    @Prop()
    oldId: number;
    @Prop()
    height: number;
    @Prop()
    weight: number;
    @Prop()
    sqMetr: number;
    @Prop()
    metr: number;
    @Prop()
    discount: number;
    @Prop()
    total: number;
    @Prop()
    price: number;
    @Prop()
    groundTotal: number;
    @Prop()
    prepayment: number;
    @Prop()
    cooperateTotal: number;
    @Prop()
    picCode: string;
    @Prop()
    comment: string;
    @Prop()
    picUrl: string;
    @Prop({ default: "progress" })
    status: string;
    @Prop()
    paymentMethod: string;
    @Prop({
        default: () => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3);
            return currentDate
        }
    })
    deadline: Date;
    @Prop({ default: new Date() })
    date: Date;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Buyer" })
    buyer: Buyer;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Cooperate" })
    cooperate: Cooperate;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Texture" })
    texture: Texture;

}

export const OrderSchema = SchemaFactory.createForClass(Order)
