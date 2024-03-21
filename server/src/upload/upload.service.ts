import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/order/schema/order.schema';
import { Upload } from './upload.module';
import { StretchCeilingOrder } from 'src/stretch-ceiling-order/schema/stretch-ceiling-order.schema';
import { NotFoundException } from '@nestjs/common';


@Injectable()
export class UploadService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel(StretchCeilingOrder.name) private stretchCeilingOrderModel: Model<StretchCeilingOrder>,

  ) { }

  async findAndUpdatPicUrl(id: string, picUrl: string) {
    const order = await this.orderModel.find({ oldId: +id })
    if (!order) {
      throw new UnauthorizedException('order not found');
    }
    await this.orderModel.updateOne({ oldId: +id }, { picUrl })
    return "order update"

  }

  async findAndUpdatStretchPicUrl(id: string, picUrl: string) {
    try {
      const result = await this.stretchCeilingOrderModel.updateOne(
        { _id: id },
        { $push: { picUrl } }
      );
  
      if (result.modifiedCount === 0) {
        throw new NotFoundException('Order not found or no modifications made');
      }
  
      return 'Order updated successfully';
    } catch (error) {
      console.error('Error updating order:', error);
      // Handle the error appropriately (throw, log, etc.)
      throw new UnauthorizedException('Error updating order');
    }
  }
  
  
  
}


