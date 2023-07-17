import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';

export type UserSphereDocument = HydratedDocument<UserSphere>;

@Schema()
export class UserSphere {
    @Prop()
    name: string;
}

export const UserSphereSchema = SchemaFactory.createForClass(UserSphere);
