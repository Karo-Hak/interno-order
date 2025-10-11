import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoopDebetKredit, CoopDebetKreditSchema } from './schema/coop-debet-kredit.schema';
import { CoopDebetKreditService } from './coop-debet-kredit.service';
import { CoopDebetKreditController } from './coop-debet-kredit.controller';
import { CoopStretchBuyer, CoopStretchBuyerSchema } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { CoopCeilingOrder, CoopCeilingOrderSchema } from 'src/coop-ceiling-order/schema/coop-ceiling-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoopDebetKredit.name, schema: CoopDebetKreditSchema },
      { name: CoopStretchBuyer.name, schema: CoopStretchBuyerSchema },
      { name: CoopCeilingOrder.name, schema: CoopCeilingOrderSchema },
    ]),
  ],
  providers: [CoopDebetKreditService],
  controllers: [CoopDebetKreditController],
  exports: [MongooseModule, CoopDebetKreditService],
})
export class CoopDebetKreditModule {}
