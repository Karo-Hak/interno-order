import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from "src/product/schema/product.schema";

export type CategoryProductDocument = HydratedDocument<CategoryProduct>;

@Schema()
export class CategoryProduct {
    @Prop()
    name: string;
    @Prop({
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
        ]
    })
    product: Product[];
}

export const CategoryProductSchema = SchemaFactory.createForClass(CategoryProduct);