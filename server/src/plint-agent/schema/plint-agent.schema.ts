import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PlintOrder } from 'src/plint-order/schema/plint-order.schema';

export type PlintAgentDocument = HydratedDocument<PlintAgent>

@Schema()
export class PlintAgent {
    @Prop()
    name: string;
    @Prop()
    phone1: string;
    @Prop()
    phone2: string;
    @Prop()
    region: string;
    @Prop()
    address: string;
    @Prop({ default: 0 })
    agentDiscount: number;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "PlintOrder" }
        ]
    })
    plintOrder: PlintOrder[];
}

export const PlintAgentSchema = SchemaFactory.createForClass(PlintAgent);

