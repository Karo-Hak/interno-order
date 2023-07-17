import { Module } from '@nestjs/common';
import { CoopStretchBuyerService } from './coop-stretch-buyer.service';
import { CoopStretchBuyerController } from './coop-stretch-buyer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoopStretchBuyer, CoopStretchBuyerSchema } from './schema/coop-stretch-buyer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoopStretchBuyer.name, schema: CoopStretchBuyerSchema },
    ])
  ],
  controllers: [CoopStretchBuyerController],
  providers: [CoopStretchBuyerService],
  exports: [CoopStretchBuyerService]
})
export class CoopStretchBuyerModule { }
