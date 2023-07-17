import { Injectable } from '@nestjs/common';
import { CreateUserSphereDto } from './dto/create-user-sphere.dto';
import { UpdateUserSphereDto } from './dto/update-user-sphere.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserSphere } from './schema/user-sphere.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserSphereService {
  constructor(@InjectModel(UserSphere.name) private userSphereModel: Model<UserSphere>) { }
  
  create(createUserSphereDto: CreateUserSphereDto) {
    return 'This action adds a new userSphere';
  }

  async findAll() {
    return await this.userSphereModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} userSphere`;
  }

  update(id: number, updateUserSphereDto: UpdateUserSphereDto) {
    return `This action updates a #${id} userSphere`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSphere`;
  }
}
