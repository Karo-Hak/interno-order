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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Путь к папке с загруженными изображениями
      serveRoot: '/uploads', // Корневой путь, по которому будут доступны изображения на сервере
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
