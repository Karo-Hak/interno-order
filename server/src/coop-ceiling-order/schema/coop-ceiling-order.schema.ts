import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CoopStretchBuyer } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { User } from 'src/user/schema/user.schema';

export type CoopCeilingOrderDocument = HydratedDocument<CoopCeilingOrder>;

@Schema()
export class CoopCeilingOrder {
    @Prop({ type: Array })
    groupedStretchTextureData: Array<object>;
    @Prop({ type: Array })
    groupedStretchProfilData: Array<object>;
    @Prop({ type: Array })
    groupedLightPlatformData: Array<object>;
    @Prop({ type: Array })
    groupedLightRingData: Array<object>;
    @Prop({ default: new Date() })
    date: Date;
    @Prop()
    buyerComment: string;
    @Prop()
    balance: number;
    @Prop()
    prepayment: number;
    @Prop()
    groundTotal: number;
    @Prop()
    paymentMethod: string;
    @Prop({ default: false })
    payed: boolean;
    @Prop({ type: Array })
    picUrl: Array<string>;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CoopStretchBuyer" })
    buyer: CoopStretchBuyer;

}

export const CoopCeilingOrderSchema = SchemaFactory.createForClass(CoopCeilingOrder);