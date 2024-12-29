import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PlintDebetKredit } from 'src/plint-debet-kredit/schema/plint-debet-kredit.schema';
import { PlintOrder } from 'src/plint-order/schema/plint-order.schema';

export type PlintBuyerDocument = HydratedDocument<PlintBuyer>;

@Schema()
export class PlintBuyer {
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
            { type: mongoose.Schema.Types.ObjectId, ref: "PlintOrder" }
        ]
    })
    plintOrder: PlintOrder[];
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "PlintDebetKredit" }
        ]
    })
    debetKredit: PlintDebetKredit[];
}

export const PlintBuyerSchema = SchemaFactory.createForClass(PlintBuyer);