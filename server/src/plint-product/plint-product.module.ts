import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintProductService } from './plint-product.service';
import { PlintProductController } from './plint-product.controller';
import { PlintProduct, PlintProductSchema } from './schema/plint-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlintProduct.name, schema: PlintProductSchema },
    ]),
  ],
  controllers: [PlintProductController],
  providers: [PlintProductService],
  exports: [PlintProductService],
})
export class PlintProductModule {}
