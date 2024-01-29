import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { StretchBuyer } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { User } from 'src/user/schema/user.schema';

export type StretchCeilingOrderDocument = HydratedDocument<StretchCeilingOrder>;

@Schema()
export class StretchCeilingOrder {

    @Prop({ type: Object })
    groupedStretchCeilings: Record<string, any>;
    @Prop({ type: Object })
    groupedAdditionals: Record<string, any>;
    @Prop({ type: Object })
    groupedProfils: Record<string, any>;
    @Prop({ type: Object })
    groupedLightPlatforms: Record<string, any>;
    @Prop({ type: Object })
    groupedLightRings: Record<string, any>;
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
    orderComment: string;
    @Prop()
    paymentMethod: string;
    @Prop()
    measureDate: Date;
    @Prop()
    installDate: Date;
    @Prop({ default: "progress" })
    status: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "StretchBuyer" })
    buyer: StretchBuyer;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop()
    code: string;
}




export const StretchCeilingOrderSchema = SchemaFactory.createForClass(StretchCeilingOrder);