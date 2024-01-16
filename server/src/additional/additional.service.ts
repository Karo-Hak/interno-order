import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdditionalDto } from './dto/create-additional.dto';
import { UpdateAdditionalDto } from './dto/update-additional.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Additional } from './schema/additional.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdditionalService {
  constructor(@InjectModel(Additional.name) private additionalModel: Model<Additional>) { }


  async create(createAdditionalDto: CreateAdditionalDto) {
    const existingStretchAdditional = await this.additionalModel.findOne({ name: createAdditionalDto.name });
    if (existingStretchAdditional) {
      throw new NotFoundException('Additional already exists');
    }
    const stretchAdditional = new this.additionalModel(createAdditionalDto);
    return stretchAdditional.save();
  }

  async findAll() {
    return await this.additionalModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} additional`;
  }

  update(id: number, updateAdditionalDto: UpdateAdditionalDto) {
    return `This action updates a #${id} additional`;
  }

  remove(id: number) {
    return `This action removes a #${id} additional`;
  }
}
