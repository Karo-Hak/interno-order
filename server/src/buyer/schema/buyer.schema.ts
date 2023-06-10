import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Order } from 'src/order/schema/order.schema';

export type BuyerDocument = HydratedDocument<Buyer>;

@Schema()
export class Buyer {
    @Prop()
    name: string;
    @Prop()
    phone: string;
    @Prop()
    adress: string;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
        ]
    })
    order: Order[];
}

export const BuyerSchema = SchemaFactory.createForClass(Buyer);
