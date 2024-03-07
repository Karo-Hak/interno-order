import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type BardutyunDocument = HydratedDocument<Bardutyun>;

@Schema()
export class Bardutyun {
    @Prop()
    name: string;
    @Prop()
    price: number;
   
}

export const BardutyunSchema = SchemaFactory.createForClass(Bardutyun);