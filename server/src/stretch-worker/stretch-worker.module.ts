import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StretchWorker, StretchWorkerSchema } from './schema/stretch-worker.schema';
import { StretchWorkerController } from './stretch-worker.controller';
import { StretchWorkerService } from './stretch-worker.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StretchWorker.name, schema: StretchWorkerSchema },
    ])
  ],
  controllers: [StretchWorkerController],
  providers: [StretchWorkerService],
  exports: [StretchWorkerService]
})
export class StretchWorkerModule { }
