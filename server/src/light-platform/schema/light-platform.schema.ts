import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type LightPlatformDocument = HydratedDocument<LightPlatform>;

@Schema()
export class LightPlatform {
    @Prop()
    name: string;
    @Prop()
    price: number;
    @Prop()
    unyt: string;
}

export const LightPlatformSchema = SchemaFactory.createForClass(LightPlatform);