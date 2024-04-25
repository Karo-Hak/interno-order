import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CoopCeilingOrder } from 'src/coop-ceiling-order/schema/coop-ceiling-order.schema';
import { CoopDebetKredit } from 'src/coop-debet-kredit/schema/coop-debet-kredit.schema';

export type CoopStretchBuyerDocument = HydratedDocument<CoopStretchBuyer>;

@Schema()
export class CoopStretchBuyer {
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
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "CoopCeilingOrder" }
        ]
    })
    coopCeilingOrder: CoopCeilingOrder[];
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "CoopDebetKredit" }
        ]
    })
    debetKredit: CoopDebetKredit[];
}

export const CoopStretchBuyerSchema = SchemaFactory.createForClass(CoopStretchBuyer);