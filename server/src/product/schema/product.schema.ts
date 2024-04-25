import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CategoryProduct } from 'src/category-product/schema/category-product.schema';


export type ProductDocument = HydratedDocument<Product>

@Schema()
export class Product {
    @Prop()
    name: string;
    @Prop()
    price: string;
    @Prop()
    coopPrice: string;
    @Prop()
    quantity: number;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "CategoryProduct" })
    categoryProduct: CategoryProduct;
}

export const ProductSchema = SchemaFactory.createForClass(Product);