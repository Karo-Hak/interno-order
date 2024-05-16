import { Module } from '@nestjs/common';
import { CoopCeilingOrderService } from './coop-ceiling-order.service';
import { CoopCeilingOrderController } from './coop-ceiling-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoopCeilingOrder, CoopCeilingOrderSchema } from './schema/coop-ceiling-order.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';
import { CoopStretchBuyer, CoopStretchBuyerSchema } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { CoopStretchBuyerModule } from 'src/coop-stretch-buyer/coop-stretch-buyer.module';
import { CoopDebetKreditModule } from 'src/coop-debet-kredit/coop-debet-kredit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoopCeilingOrder.name, schema: CoopCeilingOrderSchema },
      { name: CoopStretchBuyer.name, schema: CoopStretchBuyerSchema },
      { name: User.name, schema: UserSchema },
    ]),
    CoopStretchBuyerModule,
    UserModule,
    CoopDebetKreditModule
  ],
  controllers: [CoopCeilingOrderController],
  providers: [CoopCeilingOrderService],
  exports:[CoopCeilingOrderService]
})
export class CoopCeilingOrderModule {}
