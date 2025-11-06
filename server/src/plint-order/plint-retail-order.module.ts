import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintRetailOrder, PlintRetailOrderSchema } from './schema/plint-retail-order.schema';
import { PlintRetailOrderService } from './plint-retail-order.service';
import { PlintRetailOrderController } from './plint-retail-order.controller';
import { PlintBuyer, PlintBuyerSchema } from 'src/plintBuyer/schema/plint-buyer.schema';
import { PlintDebetKredit, PlintDebetKreditSchema } from 'src/plint-debet-kredit/schema/plint-debet-kredit.schema';
import { PlintProduct, PlintProductSchema } from 'src/plint-product/schema/plint-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlintRetailOrder.name, schema: PlintRetailOrderSchema },
      { name: PlintBuyer.name, schema: PlintBuyerSchema },
       { name: PlintDebetKredit.name, schema: PlintDebetKreditSchema },
       { name: PlintProduct.name, schema: PlintProductSchema },
    ]),
  ],
  controllers: [PlintRetailOrderController],
  providers: [PlintRetailOrderService],
})
export class PlintRetailOrderModule {}
