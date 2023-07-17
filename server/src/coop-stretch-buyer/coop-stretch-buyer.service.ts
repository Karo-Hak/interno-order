import { Injectable } from '@nestjs/common';
import { CreateCoopStretchBuyerDto } from './dto/create-coop-stretch-buyer.dto';
import { UpdateCoopStretchBuyerDto } from './dto/update-coop-stretch-buyer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoopStretchBuyer } from './schema/coop-stretch-buyer.schema';

@Injectable()
export class CoopStretchBuyerService {
  constructor(@InjectModel(CoopStretchBuyer.name) private coopStretchBuyerModel: Model<CoopStretchBuyer>) { }
  
  async create(createCoopStretchBuyerDto: CreateCoopStretchBuyerDto) {
    const createdBuyer = new this.coopStretchBuyerModel(createCoopStretchBuyerDto);
    return createdBuyer.save();
  }

  findAll() {
    return `This action returns all coopStretchBuyer`;
  }

  async findByPhone(phone: number) {
    return await this.coopStretchBuyerModel.findOne({ phone })
  }

  findOne(id: number) {
    return `This action returns a #${id} coopStretchBuyer`;
  }

  update(id: number, updateCoopStretchBuyerDto: UpdateCoopStretchBuyerDto) {
    return `This action updates a #${id} coopStretchBuyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} coopStretchBuyer`;
  }
}
