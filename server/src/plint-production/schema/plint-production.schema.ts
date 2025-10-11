import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PlintProduct } from 'src/plint-product/schema/plint-product.schema';
import { User } from 'src/user/schema/user.schema';

export type PlintgProductionDocument = HydratedDocument<PlintProduction>;

@Schema()
export class PlintProduction {
    @Prop({ type: Date, default: () => new Date() })
    date: Date;
    @Prop()
    name: string;
    @Prop()
    quantity: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "PlintProduct" })
    plint: PlintProduct;


}

export const PlintProductionSchema = SchemaFactory.createForClass(PlintProduction);