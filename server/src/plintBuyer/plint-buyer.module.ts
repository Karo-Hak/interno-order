// src/plint-buyer/plint-buyer.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintBuyer, PlintBuyerSchema } from './schema/plint-buyer.schema';
import { PlintBuyerService } from './plint-buyer.service';
import { PlintBuyerController } from './plint-buyer.controller';
import { PlintDebetKredit, PlintDebetKreditSchema } from 'src/plint-debet-kredit/schema/plint-debet-kredit.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: PlintBuyer.name, schema: PlintBuyerSchema },
    { name: PlintDebetKredit.name, schema: PlintDebetKreditSchema },

  ])],
  providers: [PlintBuyerService],
  controllers: [PlintBuyerController],
  exports: [PlintBuyerService],
})
export class PlintBuyerModule { }
