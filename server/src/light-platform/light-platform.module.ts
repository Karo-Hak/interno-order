import { Module } from '@nestjs/common';
import { LightPlatformService } from './light-platform.service';
import { LightPlatformController } from './light-platform.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LightPlatform, LightPlatformSchema } from './schema/light-platform.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LightPlatform.name, schema: LightPlatformSchema }])
  ],
  controllers: [LightPlatformController],
  providers: [LightPlatformService],
  exports: [LightPlatformService]
})
export class LightPlatformModule { }
