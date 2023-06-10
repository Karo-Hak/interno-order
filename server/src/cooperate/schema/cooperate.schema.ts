import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CooperationSphere } from 'src/cooperation-sphere/shema/cooperation-sphere.schema';
import { Order } from 'src/order/schema/order.schema';

export type CooperateDocument = HydratedDocument<Cooperate>

@Schema()
export class Cooperate {
    @Prop()
    name: string;
    @Prop()
    surname: string;
    @Prop()
    phone: string;
    @Prop({ default: 5 })
    cooperateRate: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CooperationSphere" })
    cooperationSphere: CooperationSphere;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Order" }
        ]
    })
    order: Order[];
}

export const CooperateSchema = SchemaFactory.createForClass(Cooperate);

