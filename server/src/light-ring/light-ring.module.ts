import { Module } from '@nestjs/common';
import { LightRingService } from './light-ring.service';
import { LightRingController } from './light-ring.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LightRing, LightRingSchema } from './schema/light-ring.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LightRing.name, schema: LightRingSchema },
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  controllers: [LightRingController],
  providers: [LightRingService],
  exports:[LightRingService]
})
export class LightRingModule {}
