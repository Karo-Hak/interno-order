import { Module } from '@nestjs/common';
import { CategoryProductService } from './category-product.service';
import { CategoryProductController } from './category-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryProduct, CategoryProductSchema } from './schema/category-product.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryProduct.name, schema: CategoryProductSchema },
      { name: Product.name, schema: ProductSchema },
    ])
  ],
  controllers: [CategoryProductController],
  providers: [CategoryProductService],
  exports: [CategoryProductService]
})
export class CategoryProductModule { }
