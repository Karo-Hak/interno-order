import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LightRingDocument = HydratedDocument<LightRing>;

@Schema()
export class LightRing {
    @Prop()
    name: string;
    @Prop()
    price: number;
    @Prop()
    unyt: string;
}

export const LightRingSchema = SchemaFactory.createForClass(LightRing);