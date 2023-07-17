import { Module } from '@nestjs/common';
import { CoopCeilingOrderService } from './coop-ceiling-order.service';
import { CoopCeilingOrderController } from './coop-ceiling-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoopCeilingOrder, CoopCeilingOrderSchema } from './schema/coop-ceiling-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CoopCeilingOrder.name, schema: CoopCeilingOrderSchema }])
  ],
  controllers: [CoopCeilingOrderController],
  providers: [CoopCeilingOrderService],
  exports:[CoopCeilingOrderService]
})
export class CoopCeilingOrderModule {}
