import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CoopStretchBuyer } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { StretchTexture } from 'src/stretch-texture/schema/stretch-texture.schema';
import { User } from 'src/user/schema/user.schema';

export type CoopCeilingOrderDocument = HydratedDocument<CoopCeilingOrder>;

@Schema()
export class CoopCeilingOrder {
    @Prop()
    height: number;
    @Prop()
    width: number;
    @Prop()
    sqMetr: number;
    @Prop()
    metr: number;
    @Prop()
    discount: number;
    @Prop()
    total: number;
    @Prop()
    price: number;
    @Prop()
    groundTotal: number;
    @Prop()
    prepayment: number;
    @Prop()
    picCode: string;
    @Prop()
    comment: string;
    @Prop()
    picUrl: string;
    @Prop({ default: "progress" })
    status: string;
    @Prop({
        default: () => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3);
            return currentDate
        }
    })
    deadline: Date;
    @Prop({ default: new Date() })
    date: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CoopStretchBuyer" })
    coopStretchBuyer: CoopStretchBuyer;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "StretchTexture" })
    stretchTexture: StretchTexture;





}

export const CoopCeilingOrderSchema = SchemaFactory.createForClass(CoopCeilingOrder);