import { forwardRef, Module } from '@nestjs/common';
import { StretchBuyerService } from './stretch-buyer.service';
import { StretchBuyerController } from './stretch-buyer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StretchBuyer, StretchBuyerSchema } from './schema/stretch-buyer.schema';
import { DebetKreditModule } from 'src/debet-kredit/debet-kredit.module';
import { DebetKredit, DebetKreditSchema } from 'src/debet-kredit/schema/debet-kredit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StretchBuyer.name, schema: StretchBuyerSchema },
      { name: DebetKredit.name, schema: DebetKreditSchema },
    ]),
    forwardRef(() => DebetKreditModule),
    
  ],
  controllers: [StretchBuyerController],
  providers: [StretchBuyerService],
  exports: [StretchBuyerService]
})
export class StretchBuyerModule { }
