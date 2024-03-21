import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StretchCeilingOrder } from 'src/stretch-ceiling-order/schema/stretch-ceiling-order.schema';

export type StretchWorkDocument = HydratedDocument<StretchWork>;

@Schema()
export class StretchWork {
    @Prop()
    name: string;
    @Prop()
    price: number;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "StretchCeilingOrder" }
        ]
    })
    order: StretchCeilingOrder[];
}

export const StretchWorkSchema = SchemaFactory.createForClass(StretchWork);