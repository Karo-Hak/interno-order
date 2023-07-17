import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CoopStretchBuyerDocument = HydratedDocument<CoopStretchBuyer>;

@Schema()
export class CoopStretchBuyer {
    @Prop()
    name: string;
    @Prop()
    phone: number;
}

export const CoopStretchBuyerSchema = SchemaFactory.createForClass(CoopStretchBuyer);