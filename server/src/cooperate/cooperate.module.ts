import { Module } from '@nestjs/common';
import { CooperateService } from './cooperate.service';
import { CooperateController } from './cooperate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cooperate, CooperateSchema } from './schema/cooperate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cooperate.name, schema: CooperateSchema }
    ])
  ],
  controllers: [CooperateController],
  providers: [CooperateService],
  exports: [CooperateService]
})
export class CooperateModule { }
