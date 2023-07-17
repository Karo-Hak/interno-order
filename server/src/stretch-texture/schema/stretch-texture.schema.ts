import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StretchTextureDocument = HydratedDocument<StretchTexture>;

@Schema()
export class StretchTexture {
    @Prop()
    name: string;
    @Prop()
    weight: number;
    @Prop()
    priceGarpun: number;
    @Prop()
    priceOtrez: number;
    @Prop()
    priceCoopGarpun: number;
    @Prop()
    priceCoopOtrez: number;
    @Prop()
    unyt: string;
}

export const StretchTextureSchema = SchemaFactory.createForClass(StretchTexture);