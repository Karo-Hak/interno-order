import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCooperateDto } from './dto/create-cooperate.dto';
import { UpdateCooperateDto } from './dto/update-cooperate.dto';
import { Cooperate } from './schema/cooperate.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CooperateService {
  constructor(@InjectModel(Cooperate.name) private cooperateModel: Model<Cooperate>) { }


  async create(createCooperateDto: CreateCooperateDto) {
    const { phone } = createCooperateDto;
    const buyer = await this.cooperateModel.findOne({ phone });
    if (buyer) {
      throw new NotFoundException('cooperate already exists');
    }
    const createdCooperate = new this.cooperateModel(createCooperateDto);
    return createdCooperate.save();
  }


  async findAll() {
    return await this.cooperateModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} cooperate`;
  }

  update(id: number, updateCooperateDto: UpdateCooperateDto) {
    return `This action updates a #${id} cooperate`;
  }

  remove(id: number) {
    return `This action removes a #${id} cooperate`;
  }
}
