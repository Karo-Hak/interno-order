import { Module } from '@nestjs/common';
import { PlintProductService } from './plint-product.service';
import { PlintProductController } from './plint-product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintProduct, PlintProductSchema } from './schema/plint-product.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlintProduct.name, schema: PlintProductSchema },
      { name: Product.name, schema: ProductSchema },
    ])
  ],
  controllers: [PlintProductController],
  providers: [PlintProductService],
  exports: [PlintProductService]
})
export class PlintProductModule { }
