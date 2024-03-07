import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StretchWork } from './schema/stretch-work.schema';
import { UpdateStretchWorkDto } from './dto/update-stretch-work.dto';

@Injectable()
export class StretchWorkService {
  constructor(@InjectModel(StretchWork.name) private stretchWorkModel: Model<StretchWork>) { }

  create(createStretchWorkDto: any) {
    const createdWork = new this.stretchWorkModel(createStretchWorkDto);
    return createdWork.save();
  }

  async findAll() {
    return await this.stretchWorkModel.find()
  }

  async findByPhone(workName: string) {
    return await this.stretchWorkModel.findOne({ workName: workName })
  }

 async findOne(id: string) {
    return await this.stretchWorkModel.findById(id);
  }

  update(id: number, updateStretchWorkDto: UpdateStretchWorkDto) {
    return `This action updates a #${id} stretchBuyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} stretchBuyer`;
  }
}
