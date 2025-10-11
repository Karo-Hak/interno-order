import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PlintAgent } from 'src/plint-agent/schema/plint-agent.schema';
import { PlintCoop } from 'src/plint-coop/schema/plint-coop.schema';
import { PlintBuyer } from 'src/plintBuyer/schema/plint-buyer.schema';
import { User } from 'src/user/schema/user.schema';

export type PlintgOrderDocument = HydratedDocument<PlintOrder>;

@Schema()
export class PlintOrder {
    @Prop({ type: Array })
    groupedPlintData: Array<object>;
    @Prop({ type: Date, default: () => new Date() })
    date: Date;
    @Prop()
    buyerComment: string;
    @Prop()
    balance: number;
    @Prop()
    code: string;
    @Prop()
    orderType: string;
    @Prop()
    prepayment: number;
    @Prop()
    discount: number;
    @Prop()
    deliveryAddress: string;
    @Prop()
    deliveryPhone: string;
    @Prop({ default: 0 })
    agentDiscount: number;
    @Prop({ default: 0 })
    agentTotal: number;
    @Prop()
    groundTotal: number;
    @Prop({ default: false })
    delivery: boolean;
    @Prop()
    paymentMethod: string;
    @Prop()
    deliverySum: number;
    @Prop({ default: false })
    done: boolean;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "PlintBuyer" })
    buyer: PlintBuyer;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "PlintCoop" })
    coop: PlintCoop;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "PlintAgent" })
    agent: PlintAgent;

}

export const PlintOrderSchema = SchemaFactory.createForClass(PlintOrder);