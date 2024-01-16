import { Injectable } from '@nestjs/common';
import { CreateStretchCeilingOrderDto } from './dto/create-stretch-ceiling-order.dto';
import { UpdateStretchCeilingOrderDto } from './dto/update-stretch-ceiling-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StretchCeilingOrder } from './schema/stretch-ceiling-order.schema';
import { StretchBuyer } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class StretchCeilingOrderService {
  constructor(
    @InjectModel(StretchCeilingOrder.name) private stretchCeilingOrderModel: Model<StretchCeilingOrder>,
    @InjectModel(StretchBuyer.name) private stretchBuyerModel: Model<StretchBuyer>,
    @InjectModel('User') private userModel: Model<User>,
  ) { }

  async create(createStretchCeilingOrderDto: any) {
    console.log(createStretchCeilingOrderDto);
    
    const orderBuyer = await this.stretchBuyerModel.findById(createStretchCeilingOrderDto.orderBuyer);
    const orderUser = await this.userModel.findById(createStretchCeilingOrderDto.user.userId);

    const createdOrder = await new this.stretchCeilingOrderModel({ ...createStretchCeilingOrderDto.stretchTextureOrder, user: orderUser.id, buyer: orderBuyer.id });

    await this.userModel.findByIdAndUpdate(createStretchCeilingOrderDto.user.userId, { order: [...orderUser.order, createdOrder.id] })
    await this.stretchBuyerModel.findByIdAndUpdate(createStretchCeilingOrderDto.orderBuyer, { order: [...orderBuyer.order, createdOrder.id] })

    return createdOrder.save();
  }

  async findNewOrders() {
    return await this.stretchCeilingOrderModel.find({ status: "progress" }).populate("buyer").sort({ date: -1 })
  }

  async findAll() {
    return await this.stretchCeilingOrderModel.find()
  }

  async findOne(id: string) {
    return await this.stretchCeilingOrderModel.findById(id).populate("buyer")
  }

  update(id: number, updateStretchCeilingOrderDto: UpdateStretchCeilingOrderDto) {
    return `This action updates a #${id} stretchCeilingOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} stretchCeilingOrder`;
  }
}
