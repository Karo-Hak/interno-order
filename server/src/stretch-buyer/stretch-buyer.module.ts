import { Module } from '@nestjs/common';
import { StretchBuyerService } from './stretch-buyer.service';
import { StretchBuyerController } from './stretch-buyer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StretchBuyer, StretchBuyerSchema } from './schema/stretch-buyer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StretchBuyer.name, schema: StretchBuyerSchema },
    ])
  ],
  controllers: [StretchBuyerController],
  providers: [StretchBuyerService],
  exports: [StretchBuyerService]
})
export class StretchBuyerModule { }
