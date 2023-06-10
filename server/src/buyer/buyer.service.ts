import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Buyer } from './schema/buyer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BuyerService {
  constructor(@InjectModel(Buyer.name) private buyerModel: Model<Buyer>) { }

  async create(createBuyerDto: CreateBuyerDto) {
    const { phone } = createBuyerDto;
    const buyer = await this.buyerModel.findOne({ phone });
    if (buyer) {
      throw new NotFoundException('buyer already exists');
    }
    const createdBuyer = new this.buyerModel(createBuyerDto);
    return createdBuyer.save();
  }

  async findOnyByPhone(phone: string) {
    return this.buyerModel.findOne({ phone })
  }

  findAll() {
    return this.buyerModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} buyer`;
  }



  update(id: number, updateBuyerDto: UpdateBuyerDto) {
    return `This action updates a #${id} buyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} buyer`;
  }
}
