import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintProduction, PlintProductionSchema } from './schema/plint-production.schema';
import { PlintProductionController } from './plint-production.controller';
import { PlintProductionService } from './plint-production.service';
import { PlintProduct, PlintProductSchema } from 'src/plint-product/schema/plint-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlintProduction.name, schema: PlintProductionSchema },
      { name: PlintProduct.name, schema: PlintProductSchema },
    ]),
  ],
  controllers: [PlintProductionController],
  providers: [PlintProductionService],
  exports: [PlintProductionService],
})
export class PlintProductionModule {}
