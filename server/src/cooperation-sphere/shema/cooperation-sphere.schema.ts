import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type TextureDocument = HydratedDocument<CooperationSphere>;

@Schema()
export class CooperationSphere {
    @Prop()
    name: string;
}

export const CooperationSphereSchema = SchemaFactory.createForClass(CooperationSphere);
