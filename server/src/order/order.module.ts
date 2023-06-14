import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { Cooperate, CooperateSchema } from 'src/cooperate/schema/cooperate.schema';
import { Buyer, BuyerSchema } from 'src/buyer/schema/buyer.schema';
import { BuyerModule } from 'src/buyer/buyer.module';
import { Texture, TextureSchema } from 'src/texture/schema/texture.schema';
import { TextureModule } from 'src/texture/texture.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Cooperate.name, schema: CooperateSchema },
      { name: Buyer.name, schema: BuyerSchema },
      { name: Texture.name, schema: TextureSchema },
    ]),
    BuyerModule, TextureModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule { }
