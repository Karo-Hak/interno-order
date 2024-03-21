import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StretchCeilingOrder } from 'src/stretch-ceiling-order/schema/stretch-ceiling-order.schema';

export type StretchWorkerDocument = HydratedDocument<StretchWorker>;

@Schema()
export class StretchWorker {
    @Prop()
    name: string;
    @Prop()
    Phone1: string;
    @Prop()
   Phone2: string;
    @Prop()
    Region: string;
    @Prop()
    Address: string;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "StretchCeilingOrder" }
        ]
    })
    order: StretchCeilingOrder[];
}

export const StretchWorkerSchema = SchemaFactory.createForClass(StretchWorker);