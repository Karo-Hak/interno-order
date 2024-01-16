import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CoopCeilingOrder } from 'src/coop-ceiling-order/schema/coop-ceiling-order.schema';

export type StretchTextureDocument = HydratedDocument<StretchTexture>;

@Schema()
export class StretchTexture {
    @Prop()
    name: string;
    @Prop()
    weight: number;
    @Prop()
    @Prop()
    price: number;
    priceGarpun: number;
    @Prop()
    priceOtrez: number;
    @Prop()
    priceCoopGarpun: number;
    @Prop()
    priceCoopOtrez: number;
    @Prop()
    unyt: string;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "CoopCeilingOrder" }
        ]
    })
    coopCeilingOrder: CoopCeilingOrder[];
}

export const StretchTextureSchema = SchemaFactory.createForClass(StretchTexture);