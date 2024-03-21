import { Injectable } from '@nestjs/common';
import { UpdateStretchCeilingOrderDto } from './dto/update-stretch-ceiling-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { StretchCeilingOrder } from './schema/stretch-ceiling-order.schema';
import { StretchBuyer } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { User } from 'src/user/schema/user.schema';
import { StretchTexture } from 'src/stretch-texture/schema/stretch-texture.schema';
import { Additional } from 'src/additional/schema/additional.schema';
import { ProfilService } from 'src/profil/profil.service';
import { LightRingService } from 'src/light-ring/light-ring.service';
import { StretchWorker } from 'src/stretch-worker/schema/stretch-worker.schema';

@Injectable()
export class StretchCeilingOrderService {
  constructor(
    @InjectModel(StretchCeilingOrder.name) private stretchCeilingOrderModel: Model<StretchCeilingOrder>,
    @InjectModel(StretchBuyer.name) private stretchBuyerModel: Model<StretchBuyer>,
    @InjectModel(StretchTexture.name) private stretchTextureModel: Model<StretchTexture>,
    @InjectModel(Additional.name) private additionalModel: Model<Additional>,
    @InjectModel(StretchWorker.name) private stretchWorkerModel: Model<StretchWorker>,
    @InjectModel('User') private userModel: Model<User>,

    private readonly profilService: ProfilService,
    private readonly lightRingService: LightRingService
  ) { }

  async create(createStretchCeilingOrderDto: any) {


    const orderBuyer = await this.stretchBuyerModel.findById(createStretchCeilingOrderDto.orderBuyer);
    const orderUser = await this.userModel.findById(createStretchCeilingOrderDto.user.userId);
    let orderWorkerId;

    if (createStretchCeilingOrderDto.stretchTextureOrder.stWorker === "Աշխատակից") {
      console.log(createStretchCeilingOrderDto.stretchTextureOrder.stWorker);
      const createdOrder = await new this.stretchCeilingOrderModel({ ...createStretchCeilingOrderDto.stretchTextureOrder, user: orderUser.id, buyer: orderBuyer.id, stWorker: null });
      await this.userModel.findByIdAndUpdate(createStretchCeilingOrderDto.user.userId, { order: [...orderUser.order, createdOrder.id] });
      await this.stretchBuyerModel.findByIdAndUpdate(createStretchCeilingOrderDto.orderBuyer, { order: [...orderBuyer.order, createdOrder.id] });
      return createdOrder.save();
    } else {
      const orderWorker = await this.stretchWorkerModel.findById(createStretchCeilingOrderDto.stretchTextureOrder.stWorker);
      orderWorkerId = orderWorker;
      const createdOrder = await new this.stretchCeilingOrderModel({ ...createStretchCeilingOrderDto.stretchTextureOrder, user: orderUser.id, buyer: orderBuyer.id, stretchWorker: orderWorkerId.id });
      await this.userModel.findByIdAndUpdate(createStretchCeilingOrderDto.user.userId, { order: [...orderUser.order, createdOrder.id] });
      await this.stretchBuyerModel.findByIdAndUpdate(createStretchCeilingOrderDto.orderBuyer, { order: [...orderBuyer.order, createdOrder.id] });
      await this.stretchWorkerModel.findByIdAndUpdate(orderWorkerId.id, { order: [...orderWorkerId.order, createdOrder.id] });
      return createdOrder.save();
    }

  }



  async findNewOrders() {
    return await this.stretchCeilingOrderModel.find({ status: "progress", }).populate("buyer").sort({ date: -1 })
  }
  async findMesurOrders() {
    return await this.stretchCeilingOrderModel.find({ status: "measurement" }).populate("buyer").sort({ date: -1 })
  }
  async findInstalOrders() {
    return await this.stretchCeilingOrderModel.find({ status: "installation" }).populate("buyer").sort({ date: -1 })
  }

  async filterOrder(startDate: Date, endDate: Date) {
    return await this.stretchCeilingOrderModel.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("buyer").populate("stWorker").populate("user").sort({ date: -1 })
  }

  async filterOrderMaterial(startDate: Date, endDate: Date) {
    return await this.stretchCeilingOrderModel.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      status: "dane"
    })
      .populate("buyer")
      .populate("stWorker")
      .populate("user")
      .sort({ date: -1 });
  }

  async findAll() {
    return await this.stretchCeilingOrderModel.find()
  }

  async findOne(id: string) {
    const data = (await this.stretchCeilingOrderModel.findById(id).populate("buyer").populate("stWorker"));
    return data
  }

  async update(id: string, updateStretchCeilingOrderDto: object, buyer: any, orderWorker: any) {
    const buyerCheck: { order: [string] } = await this.stretchBuyerModel.findOne(buyer._id);
    let workerCheck
    if (orderWorker) {
      workerCheck = await this.stretchWorkerModel.findOne(orderWorker._id)
    }
    await this.stretchBuyerModel.findByIdAndUpdate(buyerCheck, { order: [...buyerCheck.order, id] });
    if (workerCheck) {
      await this.stretchWorkerModel.findByIdAndUpdate(workerCheck, { order: [...workerCheck.order, id] });
      const updatedOrder = await this.stretchCeilingOrderModel.findByIdAndUpdate(id, { ...updateStretchCeilingOrderDto, stretchWorker: orderWorker.id })
    }
    const updatedOrder = await this.stretchCeilingOrderModel.findByIdAndUpdate(id, { ...updateStretchCeilingOrderDto, buyer: buyer.id })

    return updatedOrder;
  }

  async updateStatus(id: string, status: string) {
    return await this.stretchCeilingOrderModel.findByIdAndUpdate(id)
  }
  async updateStretchPayed(id: string) {
    return await this.stretchCeilingOrderModel.findByIdAndUpdate(id, { payed: true })
  }

  remove(id: number) {
    return `This action removes a #${id} stretchCeilingOrder`;
  }
}
