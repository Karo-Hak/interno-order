import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBardutyunDto } from './dto/create-bardutyun.dto';
import { UpdateBardutyunDto } from './dto/update-bardutyun.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bardutyun } from './schema/bardutyun.schema';

@Injectable()
export class BardutyunService {
  constructor(@InjectModel(Bardutyun.name) private bardutyunModel: Model<Bardutyun>) { }

  async create(createBardutyunDto: CreateBardutyunDto) {
    const existingStretchBardutyun = await this.bardutyunModel.findOne({ name: createBardutyunDto.name });
    if (existingStretchBardutyun) {
      throw new NotFoundException('Bardutyun already exists');
    }
    const stretchBardutyun = new this.bardutyunModel(createBardutyunDto);
    return stretchBardutyun.save();
  }

  async findAll() {
    return await this.bardutyunModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} bardutyun`;
  }

  update(id: number, updateBardutyunDto: UpdateBardutyunDto) {
    return `This action updates a #${id} bardutyun`;
  }

  remove(id: number) {
    return `This action removes a #${id} bardutyun`;
  }
}
