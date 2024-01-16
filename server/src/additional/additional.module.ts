import { Module } from '@nestjs/common';
import { AdditionalService } from './additional.service';
import { AdditionalController } from './additional.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Additional, AdditionalSchema } from './schema/additional.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Additional.name, schema: AdditionalSchema }])
  ],
  controllers: [AdditionalController],
  providers: [AdditionalService],
  exports: [AdditionalService]

})
export class AdditionalModule {}
