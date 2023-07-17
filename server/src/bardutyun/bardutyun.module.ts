import { Module } from '@nestjs/common';
import { BardutyunService } from './bardutyun.service';
import { BardutyunController } from './bardutyun.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bardutyun, BardutyunSchema } from './schema/bardutyun.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bardutyun.name, schema: BardutyunSchema }])
  ],
  controllers: [BardutyunController],
  providers: [BardutyunService],
  exports: [BardutyunService]
})
export class BardutyunModule {}
