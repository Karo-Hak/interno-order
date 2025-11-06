import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  price!: number;

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  coopPrice!: number;

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  quantity!: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CategoryProduct', required: true })
  categoryProduct!: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// частый кейс: найти по категории и отсортировать по имени
ProductSchema.index({ categoryProduct: 1 });

// легкая нормализация
ProductSchema.pre('save', function (next) {
  if (typeof this.name === 'string') this.name = this.name.trim();
  next();
});
