import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoopCeilingOrder, CoopCeilingOrderSchema } from './schema/coop-ceiling-order.schema';
import { CoopCeilingOrderService } from './coop-ceiling-order.service';
import { CoopCeilingOrderController } from './coop-ceiling-order.controller';

import { CoopStretchBuyer, CoopStretchBuyerSchema } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { CoopStretchBuyerModule } from 'src/coop-stretch-buyer/coop-stretch-buyer.module';
import { CoopDebetKreditModule } from 'src/coop-debet-kredit/coop-debet-kredit.module';
import { CoopDebetKredit, CoopDebetKreditSchema } from 'src/coop-debet-kredit/schema/coop-debet-kredit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoopCeilingOrder.name, schema: CoopCeilingOrderSchema },
      { name: CoopStretchBuyer.name, schema: CoopStretchBuyerSchema }, 
      { name: CoopDebetKredit.name, schema: CoopDebetKreditSchema },
    ]),
    CoopStretchBuyerModule, 
    CoopDebetKreditModule,
  ],
  providers: [CoopCeilingOrderService],
  controllers: [CoopCeilingOrderController],
  exports: [CoopCeilingOrderService],
})
export class CoopCeilingOrderModule {}
