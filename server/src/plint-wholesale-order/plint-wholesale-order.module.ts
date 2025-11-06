import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintBuyer, PlintBuyerSchema } from 'src/plintBuyer/schema/plint-buyer.schema';
import { PlintWholesaleOrder, PlintWholesaleOrderSchema } from './schema/plint-wholesale-order.schema';
import { PlintAgent, PlintAgentSchema } from 'src/plint-agent/schema/plint-agent.schema';
import { PlintWholesaleOrderController } from './plint-wholesale-order.controller';
import { PlintWholesaleOrderService } from './plint-wholesale-order.service';
import { PlintAgentDebetKredit, PlintAgentDebetKreditSchema } from 'src/plint-agent-debet-kredit/schema/plint-agent-debet-kredit.schema';
import { PlintDebetKredit, PlintDebetKreditSchema } from 'src/plint-debet-kredit/schema/plint-debet-kredit.schema';
import { PlintProduct, PlintProductSchema } from 'src/plint-product/schema/plint-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlintWholesaleOrder.name, schema: PlintWholesaleOrderSchema },
      { name: PlintBuyer.name, schema: PlintBuyerSchema },
      { name: PlintAgentDebetKredit.name, schema: PlintAgentDebetKreditSchema },
      { name: PlintDebetKredit.name, schema: PlintDebetKreditSchema },
      { name: PlintAgent.name, schema: PlintAgentSchema },
      { name: PlintProduct.name, schema: PlintProductSchema },
    ]),
  ],
  controllers: [PlintWholesaleOrderController],
  providers: [PlintWholesaleOrderService],

})
export class PlintWholesaleOrderModule { }
