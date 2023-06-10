import { Module } from '@nestjs/common';
import { CooperationSphereService } from './cooperation-sphere.service';
import { CooperationSphereController } from './cooperation-sphere.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CooperationSphere, CooperationSphereSchema } from './shema/cooperation-sphere.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CooperationSphere.name, schema: CooperationSphereSchema }])],

  controllers: [CooperationSphereController],
  providers: [CooperationSphereService]
})
export class CooperationSphereModule {}
