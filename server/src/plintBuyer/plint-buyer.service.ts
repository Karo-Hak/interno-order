import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlintBuyer } from './schema/plint-buyer.schema';
import { UpdatePlintBuyerDto } from './dto/update-plint-buyer.dto';

@Injectable()
export class PlintBuyerService {
  constructor(
    @InjectModel(PlintBuyer.name) private plintBuyerModel: Model<PlintBuyer>
  ) { }

  create(createPlintBuyerDto: any) {
    const createdBuyer = new this.plintBuyerModel(createPlintBuyerDto);
    return createdBuyer.save();
  }

  async findAll() {
    return await this.plintBuyerModel.find()
  }

  async findByPhone(phone: string) {
    return await this.plintBuyerModel.findOne({ buyerPhone1: phone })
  }

  async findOne(id: string) {
    return await this.plintBuyerModel.findById(id);
  }

  async deleteFromArray(id: any, deleteId: any) {
    await this.plintBuyerModel.findByIdAndUpdate(
      id,
      { $pull: { order: new Types.ObjectId(deleteId) } },
      { new: true }
    );
  }
  async removeDebetKreditFromBuyers(debetKreditIds: string[]) {
    return await this.plintBuyerModel.updateMany(
        {},
        { $pull: { debetKredit: { $in: debetKreditIds } } } 
    );
}


  update(id: number, updatePlintBuyerDto: UpdatePlintBuyerDto) {
    return `This action updates a #${id} stretchBuyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} stretchBuyer`;
  }
}
