import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProfilDocument = HydratedDocument<Profil>;

@Schema()
export class Profil {
    @Prop()
    name: string;



}

export const ProfilSchema = SchemaFactory.createForClass(Profil);