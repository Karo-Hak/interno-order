import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/order/schema/order.schema';
import { Upload } from './upload.module';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
  ) { }

  async findAndUpdatPicUrl(id: string, picUrl: string) {
    const order = await this.orderModel.find({ oldId: +id })
    if (!order) {
      throw new UnauthorizedException('order not found');
    }
    await this.orderModel.updateOne({ oldId: +id }, { picUrl })
    return "order update"

  }
}


