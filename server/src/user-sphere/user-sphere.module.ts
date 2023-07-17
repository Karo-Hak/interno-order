import { Module } from '@nestjs/common';
import { UserSphereService } from './user-sphere.service';
import { UserSphereController } from './user-sphere.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSphere, UserSphereSchema } from './schema/user-sphere.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name:  UserSphere.name, schema:  UserSphereSchema }])
  ],
  controllers: [UserSphereController],
  providers: [UserSphereService],
  exports:[ UserSphereService]
})
export class UserSphereModule {}
