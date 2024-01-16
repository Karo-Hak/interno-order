import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CoopCeilingOrder } from 'src/coop-ceiling-order/schema/coop-ceiling-order.schema';

export type CoopStretchBuyerDocument = HydratedDocument<CoopStretchBuyer>;

@Schema()
export class CoopStretchBuyer {
    @Prop()
    name: string;
    @Prop()
    phone: number;
    @Prop()
    adress: string;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "CoopCeilingOrder" }
        ]
    })
    coopCeilingOrder: CoopCeilingOrder[];
}

export const CoopStretchBuyerSchema = SchemaFactory.createForClass(CoopStretchBuyer);