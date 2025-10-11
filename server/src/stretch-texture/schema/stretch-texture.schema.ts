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
    price: number;
    @Prop()
    coopPrice: number;
    @Prop()
    priceCoopOtrez: number;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "CoopCeilingOrder" }
        ]
    })
    coopCeilingOrder: CoopCeilingOrder[];
}

export const StretchTextureSchema = SchemaFactory.createForClass(StretchTexture);