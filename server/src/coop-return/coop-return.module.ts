import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoopReturn, CoopReturnSchema } from './schema/coop-return.schema';
import { CoopReturnService } from './coop-return.service';
import { CoopReturnController } from './coop-return.controller';
import { CoopStretchBuyer, CoopStretchBuyerSchema } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { CoopDebetKredit, CoopDebetKreditSchema } from 'src/coop-debet-kredit/schema/coop-debet-kredit.schema';
import { CoopCeilingOrder, CoopCeilingOrderSchema } from 'src/coop-ceiling-order/schema/coop-ceiling-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoopReturn.name, schema: CoopReturnSchema },
      { name: CoopStretchBuyer.name, schema: CoopStretchBuyerSchema },
      { name: CoopDebetKredit.name, schema: CoopDebetKreditSchema },
      { name: CoopCeilingOrder.name, schema: CoopCeilingOrderSchema },
    ]),
  ],
  providers: [CoopReturnService],
  controllers: [CoopReturnController],
  exports: [MongooseModule, CoopReturnService],
})
export class CoopReturnModule {}
