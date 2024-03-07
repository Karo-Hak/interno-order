import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StretchWorker } from './schema/stretch-worker.schema';
import { UpdateStretchWorkerDto } from './dto/update-stretch-worker.dto';

@Injectable()
export class StretchWorkerService {
  constructor(@InjectModel(StretchWorker.name) private stretchWorkerModel: Model<StretchWorker>) { }

  create(createStretchWorkerDto: any) {
    const createdWorker = new this.stretchWorkerModel(createStretchWorkerDto);
    return createdWorker.save();
  }

  async findAll() {
    return await this.stretchWorkerModel.find()
  }

  async findByPhone(phone1: string) {
    return await this.stretchWorkerModel.findOne({ workerPhone1: phone1 })
  }

 async findOne(id: string) {
    return await this.stretchWorkerModel.findById(id);
  }

  update(id: number, updateStretchWorkerDto: UpdateStretchWorkerDto) {
    return `This action updates a #${id} stretchBuyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} stretchBuyer`;
  }
}
