import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';

export type UnytDocument = HydratedDocument<Unyt>;

@Schema()
export class Unyt {
    @Prop()
    name: string;
}

export const UnytSchema = SchemaFactory.createForClass(Unyt);
