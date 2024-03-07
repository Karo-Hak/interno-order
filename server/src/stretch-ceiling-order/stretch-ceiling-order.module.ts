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
import { Profil, ProfilSchema } from 'src/profil/schema/profil.schema';
import { ProfilService } from 'src/profil/profil.service';
import { LightRingService } from 'src/light-ring/light-ring.service';
import { LightRing, LightRingSchema } from 'src/light-ring/schema/light-ring.schema';
import { StretchWorker, StretchWorkerSchema } from 'src/stretch-worker/schema/stretch-worker.schema';
import { StretchWork, StretchWorkSchema } from 'src/stretch-work/schema/stretch-work.schema';
import { StretchWorkerModule } from 'src/stretch-worker/stretch-worker.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StretchCeilingOrder.name, schema: StretchCeilingOrderSchema },
      { name: StretchBuyer.name, schema: StretchBuyerSchema },
      { name: StretchWorker.name, schema: StretchWorkerSchema },
      { name: StretchWork.name, schema: StretchWorkSchema },
      { name: StretchTexture.name, schema: StretchTextureSchema },
      { name: Additional.name, schema: AdditionalSchema },
      { name: Profil.name, schema: ProfilSchema },
      { name: LightRing.name, schema: LightRingSchema },
      { name: User.name, schema: UserSchema },
    ]),
    StretchBuyerModule, UserModule, StretchWorkerModule
  ],
  controllers: [StretchCeilingOrderController],
  providers: [StretchCeilingOrderService, ProfilService, LightRingService],
  exports: [StretchCeilingOrderService]
})
export class StretchCeilingOrderModule { }
