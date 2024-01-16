import { Module } from '@nestjs/common';
import { StretchCeilingOrderService } from './stretch-ceiling-order.service';
import { StretchCeilingOrderController } from './stretch-ceiling-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StretchCeilingOrder, StretchCeilingOrderSchema } from './schema/stretch-ceiling-order.schema';
import { StretchBuyer, StretchBuyerSchema } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { StretchBuyerModule } from 'src/stretch-buyer/stretch-buyer.module';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StretchCeilingOrder.name, schema: StretchCeilingOrderSchema },
      { name: StretchBuyer.name, schema: StretchBuyerSchema },
      { name: User.name, schema: UserSchema },
    ]),
    StretchBuyerModule, UserModule
  ],
  controllers: [StretchCeilingOrderController],
  providers: [StretchCeilingOrderService],
  exports: [StretchCeilingOrderService]
})
export class StretchCeilingOrderModule { }
