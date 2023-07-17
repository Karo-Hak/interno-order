import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StretchBuyerDocument = HydratedDocument<StretchBuyer>;

@Schema()
export class StretchBuyer {
    @Prop()
    name: string;
    @Prop()
    phone: number;
}

export const StretchBuyerSchema = SchemaFactory.createForClass(StretchBuyer);