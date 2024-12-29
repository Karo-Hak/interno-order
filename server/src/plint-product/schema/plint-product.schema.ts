import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from "src/product/schema/product.schema";

export type PlintProductDocument = HydratedDocument<PlintProduct>;

@Schema()
export class PlintProduct {
    @Prop()
    name: string;
    @Prop()
    price: string;
    @Prop()
    quantity: string;

}

export const PlintProductSchema = SchemaFactory.createForClass(PlintProduct);