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
import { ProfilModule } from './profil/profil.module';
import { LightPlatformModule } from './light-platform/light-platform.module';
import { LightRingModule } from './light-ring/light-ring.module';
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
import { PlintOrderModule } from './plint-order/plint-order.module';
import { PlintDebetKreditModule } from './plint-debet-kredit/plint-debet-kredit.module';
import { DebetKreditModule } from './debet-kredit/debet-kredit.module';
import { CoopDebetKreditModule } from './coop-debet-kredit/coop-debet-kredit.module';
import { PlintProductionModule } from './plint-production/plint-production.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/order'),
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
    PlintOrderModule,
    PlintProductionModule,
    PlintDebetKreditModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Путь к папке с загруженными изображениями
      serveRoot: '/uploads', // Корневой путь, по которому будут доступны изображения на сервере
    }),
    BardutyunModule,
    ProfilModule,
    LightPlatformModule,
    LightRingModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
