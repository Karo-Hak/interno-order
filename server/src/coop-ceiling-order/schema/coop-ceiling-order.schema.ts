import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CoopCeilingOrderDocument = HydratedDocument<CoopCeilingOrder>;

@Schema()
export class CoopCeilingOrder {
    @Prop()
    name: string;
    



}

export const CoopCeilingOrderSchema = SchemaFactory.createForClass(CoopCeilingOrder);