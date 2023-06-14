import { Module } from '@nestjs/common';
import { CooperateService } from './cooperate.service';
import { CooperateController } from './cooperate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cooperate, CooperateSchema } from './schema/cooperate.schema';
import { CooperationSphere, CooperationSphereSchema } from 'src/cooperation-sphere/shema/cooperation-sphere.schema';
import { CooperationSphereModule } from 'src/cooperation-sphere/cooperation-sphere.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cooperate.name, schema: CooperateSchema },
      { name: CooperationSphere.name, schema: CooperationSphereSchema}
    ]), CooperationSphereModule
  ],
  controllers: [CooperateController],
  providers: [CooperateService],
  exports: [CooperateService]
})
export class CooperateModule { }
