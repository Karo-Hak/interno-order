import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { Buyer } from 'src/buyer/schema/buyer.schema';
import { Cooperate } from 'src/cooperate/schema/cooperate.schema';
import { User } from 'src/user/schema/user.schema';
import { Texture } from 'src/texture/schema/texture.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectModel('Buyer') private buyerModel: Model<Buyer>,
    @InjectModel('Cooperate') private cooperateModel: Model<Cooperate>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel("Texture") private textureModel: Model<Texture>,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    if (createOrderDto.cooperate == "0") {
      createOrderDto = { ...createOrderDto, cooperate: null }
    }

    const orderBuyer = await this.buyerModel.findById(createOrderDto.buyer);
    const orderCooperaye = await this.cooperateModel.findById(createOrderDto.cooperate);
    const orderUser = await this.userModel.findById(createOrderDto.user);
    const orderTexture = await this.textureModel.findById(createOrderDto.texture);
    const newOrder = await new this.orderModel(createOrderDto);
    if (createOrderDto.cooperate !== null) {
      await this.cooperateModel.findByIdAndUpdate(createOrderDto.cooperate, { order: [...orderCooperaye.order, newOrder.id] })
    }
    await this.buyerModel.findByIdAndUpdate(createOrderDto.buyer, { order: [...orderBuyer.order, newOrder.id]})
    await this.userModel.findByIdAndUpdate(createOrderDto.user, { order: [...orderUser.order, newOrder.id] })
    await this.textureModel.findByIdAndUpdate(createOrderDto.texture, { order: [...orderTexture.order, newOrder.id] })

    return newOrder.save();
  }

  async findNewOrders() {
    return await this.orderModel.find({ status: "progress" }).populate("buyer").populate("texture")
  }

  async findOne(id: string) {
    return await this.orderModel.findById(id).populate("buyer").populate("texture").populate("cooperate");
  }

  async findOneBuoldID(id: number) {
    return await this.orderModel.find({ oldId: id }).populate("buyer").populate("texture");
  }

  async updateStatus(id: string) {
    return await this.orderModel.findByIdAndUpdate(id, { status: "done" })
  }

  async updatePrepayment(id: string, prepayment: number, groundTotal: number) {
    return await this.orderModel.findByIdAndUpdate(id, { prepayment, groundTotal })
  }

  async filterOrder(startDate: Date, endDate: Date) {
    return await this.orderModel.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("texture").populate("buyer").populate("cooperate").populate("user")
  }

  findAll() {
    return `This action returns all order`;
  }
  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
