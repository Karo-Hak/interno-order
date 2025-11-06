import { Module } from '@nestjs/common';
import { StretchCeilingOrderService } from './stretch-ceiling-order.service';
import { StretchCeilingOrderController } from './stretch-ceiling-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StretchCeilingOrder, StretchCeilingOrderSchema } from './schema/stretch-ceiling-order.schema';
import { StretchBuyer, StretchBuyerSchema } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { StretchBuyerModule } from 'src/stretch-buyer/stretch-buyer.module';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';
import { StretchTexture, StretchTextureSchema } from 'src/stretch-texture/schema/stretch-texture.schema';
import { Additional, AdditionalSchema } from 'src/additional/schema/additional.schema';
import { StretchWorker, StretchWorkerSchema } from 'src/stretch-worker/schema/stretch-worker.schema';
import { StretchWork, StretchWorkSchema } from 'src/stretch-work/schema/stretch-work.schema';
import { StretchWorkerModule } from 'src/stretch-worker/stretch-worker.module';
import { ProductModule } from 'src/product/product.module';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { DebetKredit, DebetKreditSchema } from 'src/debet-kredit/schema/debet-kredit.schema';
import { DebetKreditModule } from 'src/debet-kredit/debet-kredit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StretchCeilingOrder.name, schema: StretchCeilingOrderSchema },
      { name: StretchBuyer.name, schema: StretchBuyerSchema },
      { name: StretchWorker.name, schema: StretchWorkerSchema },
      { name: StretchWork.name, schema: StretchWorkSchema },
      { name: StretchTexture.name, schema: StretchTextureSchema },
      { name: Additional.name, schema: AdditionalSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: DebetKredit.name, schema: DebetKreditSchema },
    ]),
    StretchBuyerModule,
    UserModule,
    StretchWorkerModule,
    ProductModule,
    DebetKreditModule
  ],
  controllers: [StretchCeilingOrderController],
  providers: [StretchCeilingOrderService],
  exports: [StretchCeilingOrderService]
})
export class StretchCeilingOrderModule { }
