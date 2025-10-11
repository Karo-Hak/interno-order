// coop-stretch-buyer.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoopStretchBuyer, CoopStretchBuyerSchema } from './schema/coop-stretch-buyer.schema';
import { CoopStretchBuyerService } from './coop-stretch-buyer.service';
import { CoopStretchBuyerController } from './coop-stretch-buyer.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CoopStretchBuyer.name, schema: CoopStretchBuyerSchema }]),
  ],
  providers: [CoopStretchBuyerService],
  controllers: [CoopStretchBuyerController],
  exports: [CoopStretchBuyerService],
})
export class CoopStretchBuyerModule { }

