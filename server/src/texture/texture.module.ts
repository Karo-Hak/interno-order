import { Module } from '@nestjs/common';
import { TextureService } from './texture.service';
import { TextureController } from './texture.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Texture, TextureSchema } from './schema/texture.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Texture.name, schema: TextureSchema }])],
  controllers: [TextureController],
  providers: [TextureService],
  exports: [TextureService]
})
export class TextureModule { }
