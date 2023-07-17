import { Module } from '@nestjs/common';
import { StretchTextureService } from './stretch-texture.service';
import { StretchTextureController } from './stretch-texture.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StretchTexture, StretchTextureSchema } from './schema/stretch-texture.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StretchTexture.name, schema: StretchTextureSchema }])
  ],
  controllers: [StretchTextureController],
  providers: [StretchTextureService],
  exports: [StretchTextureService]
})
export class StretchTextureModule { }
