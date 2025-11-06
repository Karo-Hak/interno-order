import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { BuyerModule } from './buyer/buyer.module';
import { TextureModule } from './texture/texture.module';
import { CooperateModule } from './cooperate/cooperate.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CooperationSphereModule } from './cooperation-sphere/cooperation-sphere.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BardutyunModule } from './bardutyun/bardutyun.module';
import { CoopCeilingOrderModule } from './coop-ceiling-order/coop-ceiling-order.module';
import { UnytModule } from './unyt/unyt.module';
import { UserSphereModule } from './user-sphere/user-sphere.module';
import { StretchTextureModule } from './stretch-texture/stretch-texture.module';
import { StretchBuyerModule } from './stretch-buyer/stretch-buyer.module';
import { CoopStretchBuyerModule } from './coop-stretch-buyer/coop-stretch-buyer.module';
import { AdditionalModule } from './additional/additional.module';
import { StretchCeilingOrderModule } from './stretch-ceiling-order/stretch-ceiling-order.module';
import { StretchWorkerModule } from './stretch-worker/stretch-worker.module';
import { StretchWorkModule } from './stretch-work/stretch-worker.module';
import { ProductModule } from './product/product.module';
import { CategoryProductModule } from './category-product/category-product.module';
import { PlintProductModule } from './plint-product/plint-product.module';
import { PlintBuyerModule } from './plintBuyer/plint-buyer.module';
import { PlintRetailOrderModule } from './plint-order/plint-retail-order.module';
import { PlintDebetKreditModule } from './plint-debet-kredit/plint-debet-kredit.module';
import { DebetKreditModule } from './debet-kredit/debet-kredit.module';
import { CoopDebetKreditModule } from './coop-debet-kredit/coop-debet-kredit.module';
import { PlintProductionModule } from './plint-production/plint-production.module';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { CoopReturnModule } from './coop-return/coop-return.module';
import { PlintAgentModule } from './plint-agent/plint-agent.module';
import { PlintWholesaleOrderModule } from './plint-wholesale-order/plint-wholesale-order.module';
import { PlintAgentDebetKreditModule } from './plint-agent-debet-kredit/plint-agent-debet-kredit.module';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://127.0.0.1:27017/order?replicaSet=rs0',
      {
        serverSelectionTimeoutMS: 5000,
        directConnection: false, // т.к. replicaSet=rs0
      }
    ),


    UserModule,
    OrderModule,
    BuyerModule,
    TextureModule,
    CooperateModule,
    CooperationSphereModule,
    AuthModule,
    UploadModule,
    ProductModule,
    CategoryProductModule,
    PlintProductModule,
    PlintBuyerModule,
    PlintAgentModule,
    PlintRetailOrderModule,
    PlintWholesaleOrderModule,
    PlintProductionModule,
    PlintDebetKreditModule,
    PlintAgentDebetKreditModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Путь к папке с загруженными изображениями
      serveRoot: '/uploads', // Корневой путь, по которому будут доступны изображения на сервере
    }),
    BardutyunModule,
    CoopCeilingOrderModule,
    UnytModule,
    UserSphereModule,
    StretchTextureModule,
    StretchBuyerModule,
    StretchWorkerModule,
    StretchWorkModule,
    StretchWorkModule,
    CoopStretchBuyerModule,
    AdditionalModule,
    StretchCeilingOrderModule,
    DebetKreditModule,
    CoopDebetKreditModule,
    TelegramModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CoopReturnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
