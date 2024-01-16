import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AdditionalDocument = HydratedDocument<Additional>;

@Schema()
export class Additional {
    @Prop()
    name: string;
    @Prop()
    price: number;
    @Prop()
    unyt: string;
}

export const AdditionalSchema = SchemaFactory.createForClass(Additional);