import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StretchWork, StretchWorkSchema } from './schema/stretch-work.schema';
import { StretchWorkController } from './stretch-work.controller';
import { StretchWorkService } from './stretch-work.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StretchWork.name, schema: StretchWorkSchema },
    ])
  ],
  controllers: [StretchWorkController],
  providers: [StretchWorkService],
  exports: [StretchWorkService]
})
export class StretchWorkModule { }
