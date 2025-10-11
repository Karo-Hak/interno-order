import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DebetKredit } from 'src/debet-kredit/schema/debet-kredit.schema';
import { StretchCeilingOrder } from 'src/stretch-ceiling-order/schema/stretch-ceiling-order.schema';

export type StretchBuyerDocument = HydratedDocument<StretchBuyer>;

@Schema()
export class StretchBuyer {
    @Prop() buyerName: string;
    @Prop() buyerPhone1: string;
    @Prop() buyerPhone2: string;
    @Prop() buyerRegion: string;
    @Prop() buyerAddress: string;

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StretchCeilingOrder' }],
        default: [],
    })
    order: StretchCeilingOrder[];

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DebetKredit' }],
        default: [],
    })
    debetKredit: DebetKredit[];

    // 1) credit: [{ date, sum }]
    @Prop({
        type: [{
            _id: false,
            date: { type: Date, required: true },
            sum: { type: Number, required: true, min: 0 },
        }],
        default: [],
    })
    credit: { date: Date; sum: number }[];

    // 2) buy: [{ date, sum, orderId }]
    @Prop({
        type: [{
            _id: false,
            date: { type: Date, required: true },
            sum: { type: Number, required: true, min: 0 },
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'StretchCeilingOrder',
                required: true,
            },
        }],
        default: [],
    })
    buy: { date: Date; sum: number; orderId: mongoose.Types.ObjectId }[];

    _id: any;
    @Prop({ type: Number, default: 0 })
    totalSum: number;

}

export const StretchBuyerSchema = SchemaFactory.createForClass(StretchBuyer);
