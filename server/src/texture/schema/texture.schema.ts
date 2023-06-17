import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';
import { Order } from "src/order/schema/order.schema";


export type TextureDocument = HydratedDocument<Texture>;

@Schema()
export class Texture {
    @Prop()
    name: string;
    @Prop()
    price: number;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
        ]
    })
    order: Order[];
};


export const TextureSchema = SchemaFactory.createForClass(Texture);
