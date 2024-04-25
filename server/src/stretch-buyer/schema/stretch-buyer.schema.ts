import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DebetKredit } from 'src/debet-kredit/schema/debet-kredit.schema';
import { StretchCeilingOrder } from 'src/stretch-ceiling-order/schema/stretch-ceiling-order.schema';

export type StretchBuyerDocument = HydratedDocument<StretchBuyer>;

@Schema()
export class StretchBuyer {
    @Prop()
    buyerName: string;
    @Prop()
    buyerPhone1: string;
    @Prop()
    buyerPhone2: string;
    @Prop()
    buyerRegion: string;
    @Prop()
    buyerAddress: string;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "StretchCeilingOrder" }
        ]
    })
    order: StretchCeilingOrder[];
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "DebetKredit" }
        ]
    })
    debetKredit: DebetKredit[];
  _id: any;
}

export const StretchBuyerSchema = SchemaFactory.createForClass(StretchBuyer);