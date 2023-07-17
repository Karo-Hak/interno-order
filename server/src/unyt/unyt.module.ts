import { Module } from '@nestjs/common';
import { UnytService } from './unyt.service';
import { UnytController } from './unyt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Unyt, UnytSchema } from './schema/unyt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Unyt.name, schema: UnytSchema }])
  ],
  controllers: [UnytController],
  providers: [UnytService],
  exports: [UnytService]
})
export class UnytModule {}
