import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';
import { Cooperate } from "src/cooperate/schema/cooperate.schema";

export type TextureDocument = HydratedDocument<CooperationSphere>;

@Schema()
export class CooperationSphere {
    @Prop()
    name: string;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Cooperate" }
        ]
    })
    cooperate: Cooperate[];
}

export const CooperationSphereSchema = SchemaFactory.createForClass(CooperationSphere);
