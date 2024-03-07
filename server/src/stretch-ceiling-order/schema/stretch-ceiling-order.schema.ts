import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { StretchBuyer } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { StretchWorker } from 'src/stretch-worker/schema/stretch-worker.schema';
import { User } from 'src/user/schema/user.schema';

export type StretchCeilingOrderDocument = HydratedDocument<StretchCeilingOrder>;

@Schema()
export class StretchCeilingOrder {
    @Prop({ type: Array })
    rooms: {
        name: string;
        id: string;
        groupedStretchCeilings: Record<string, any>;
        groupedAdditionals: Record<string, any>;
        groupedProfils: Record<string, any>;
        groupedLightPlatforms: Record<string, any>;
        groupedLightRings: Record<string, any>;
        groupedBardutyuns: Record<string, any>;
        groupedOthers: Record<string, any>;
    };
    @Prop({ type: Object })
    groupedWorks: object
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
    @Prop()
    code: string;
    @Prop()
    salary: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "StretchBuyer" })
    buyer: StretchBuyer;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "StretchWorker" })
    stretchWorker: StretchWorker;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;

}




export const StretchCeilingOrderSchema = SchemaFactory.createForClass(StretchCeilingOrder);