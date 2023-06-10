import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Buyer, BuyerSchema } from './schema/buyer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Buyer.name, schema: BuyerSchema }])
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService]
})
export class BuyerModule { }
