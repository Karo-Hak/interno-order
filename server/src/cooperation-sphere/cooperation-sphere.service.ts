import { Injectable } from '@nestjs/common';
import { CreateCooperationSphereDto } from './dto/create-cooperation-sphere.dto';
import { UpdateCooperationSphereDto } from './dto/update-cooperation-sphere.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CooperationSphere } from './shema/cooperation-sphere.schema';

@Injectable()
export class CooperationSphereService {
  constructor(@InjectModel(CooperationSphere.name) private cooperationSphereModel: Model<CooperationSphere>) { }

  create(createCooperationSphereDto: CreateCooperationSphereDto) {
    return 'This action adds a new cooperationSphere';
  }

  async findAll() {
    return await this.cooperationSphereModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} cooperationSphere`;
  }

  update(id: number, updateCooperationSphereDto: UpdateCooperationSphereDto) {
    return `This action updates a #${id} cooperationSphere`;
  }

  remove(id: number) {
    return `This action removes a #${id} cooperationSphere`;
  }
}
