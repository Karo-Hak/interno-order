import { Injectable } from '@nestjs/common';
import { CreateStretchBuyerDto } from './dto/create-stretch-buyer.dto';
import { UpdateStretchBuyerDto } from './dto/update-stretch-buyer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StretchBuyer } from './schema/stretch-buyer.schema';

@Injectable()
export class StretchBuyerService {
  constructor(@InjectModel(StretchBuyer.name) private stretchBuyerModel: Model<StretchBuyer>) { }

  create(createStretchBuyerDto: any) {
    const createdBuyer = new this.stretchBuyerModel(createStretchBuyerDto);
    return createdBuyer.save();
  }

  async findAll() {
    return await this.stretchBuyerModel.find()
  }

  async findByPhone(phone: string) {
    return await this.stretchBuyerModel.findOne({ buyerPhone: phone })
  }

 async findOne(id: string) {
    return await this.stretchBuyerModel.findById(id);
  }

  update(id: number, updateStretchBuyerDto: UpdateStretchBuyerDto) {
    return `This action updates a #${id} stretchBuyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} stretchBuyer`;
  }
}
