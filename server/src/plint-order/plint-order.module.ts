import { Module } from '@nestjs/common';
import { PlintOrderService } from './plint-order.service';
import { PlintOrderController } from './plint-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintOrder, PlintOrderSchema } from './schema/plint-order.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';
import { PlintBuyer, PlintBuyerSchema } from 'src/plintBuyer/schema/plint-buyer.schema';
import { PlintBuyerModule } from 'src/plintBuyer/plint-buyer.module';
import { PlintCoop, PlintCoopSchema } from 'src/plint-coop/schema/plint-coop.schema';
import { PlintCoopModule } from 'src/plint-coop/plint-coop.module';
import { PlintDebetKreditModule } from 'src/plint-debet-kredit/plint-debet-kredit.module';
import { PlintProduct, PlintProductSchema } from 'src/plint-product/schema/plint-product.schema';
import { PlintProductModule } from 'src/plint-product/plint-product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlintOrder.name, schema: PlintOrderSchema },
      { name: PlintBuyer.name, schema: PlintBuyerSchema },
      { name: PlintCoop.name, schema: PlintCoopSchema },
      { name: User.name, schema: UserSchema },
      {name: PlintProduct.name, schema: PlintProductSchema }
    ]),
    PlintBuyerModule,
    UserModule,
    PlintCoopModule,
    PlintDebetKreditModule,
    PlintProductModule

  ],
  controllers: [PlintOrderController],
  providers: [PlintOrderService],
  exports:[PlintOrderService]
})
export class PlintOrderModule {}
