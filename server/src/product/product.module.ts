import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { CategoryProductModule } from 'src/category-product/category-product.module';
import { CategoryProduct, CategoryProductSchema } from 'src/category-product/schema/category-product.schema';
import { BuyProduct, BuyProductSchema } from 'src/product/schema/buy-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: CategoryProduct.name, schema: CategoryProductSchema },
      { name: BuyProduct.name, schema: BuyProductSchema },
    ]),
    CategoryProductModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[ProductService],
})
export class ProductModule {}
