import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintBuyer, PlintBuyerSchema } from './schema/plint-buyer.schema';
import { PlintBuyerController } from './plint-buyer.controller';
import { PlintBuyerService } from './plint-buyer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlintBuyer.name, schema: PlintBuyerSchema },
    ])
  ],
  controllers: [PlintBuyerController],
  providers: [PlintBuyerService],
  exports: [PlintBuyerService]
})
export class PlintBuyerModule { }
