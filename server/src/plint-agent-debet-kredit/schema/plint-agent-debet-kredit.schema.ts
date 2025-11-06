import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PlintAgent } from 'src/plint-agent/schema/plint-agent.schema';
import { PlintWholesaleOrder } from 'src/plint-wholesale-order/schema/plint-wholesale-order.schema';
import { PlintBuyer } from 'src/plintBuyer/schema/plint-buyer.schema';
import { User } from 'src/user/schema/user.schema';

export type PlintAgentDebetKreditDocument = HydratedDocument<PlintAgentDebetKredit>;

@Schema({ timestamps: true, collection: 'plint_agent_debetKredit'})
export class PlintAgentDebetKredit {
  @Prop({ type: Date, default: () => new Date() }) date: Date;
  @Prop({ required: true, trim: true }) type: string; // "Գնում" | "Վճարում"
  @Prop({ type: Number, required: true, min: 0 }) amount: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }) user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PlintBuyer', required: true }) buyer: PlintBuyer;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PlintAgent', required: true }) agent: PlintAgent;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PlintWholesaleOrder', required: false, default: null })
  order?: PlintWholesaleOrder | null;
}

export const PlintAgentDebetKreditSchema = SchemaFactory.createForClass(PlintAgentDebetKredit);

PlintAgentDebetKreditSchema.index({ order: 1, date: -1, _id: -1 });
PlintAgentDebetKreditSchema.index({ agent: 1, date: -1, _id: -1 });
PlintAgentDebetKreditSchema.index({ type: 1 });
