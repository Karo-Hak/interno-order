import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StretchCeilingOrder } from './schema/stretch-ceiling-order.schema';
import { StretchBuyer } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { User } from 'src/user/schema/user.schema';
import { StretchWorker } from 'src/stretch-worker/schema/stretch-worker.schema';
import { DebetKreditService } from 'src/debet-kredit/debet-kredit.service';
import { UpdateStretchCeilingOrderDto } from './dto/update-stretch-ceiling-order.dto';
import { StretchBuyerService } from 'src/stretch-buyer/stretch-buyer.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StretchCeilingOrderService {
  constructor(
    @InjectModel(StretchCeilingOrder.name) private stretchCeilingOrderModel: Model<StretchCeilingOrder>,
    @InjectModel(StretchBuyer.name) private stretchBuyerModel: Model<StretchBuyer>,
    @InjectModel(StretchWorker.name) private stretchWorkerModel: Model<StretchWorker>,
    @InjectModel('User') private userModel: Model<User>,

    private readonly debetKreditService: DebetKreditService,
    private readonly stretchBuyerService: StretchBuyerService,
    private readonly userService: UserService,
  ) { }


  async create(createStretchCeilingOrderDto: any) {
  const { orderBuyer, user } = createStretchCeilingOrderDto;

  const orderBuyerDocument = await this.stretchBuyerModel.findById(orderBuyer);
  if (!orderBuyerDocument) {
    throw new Error('Order buyer not found');
  }

  const orderUserDocument = await this.userModel.findById(user.userId);
  if (!orderUserDocument) {
    throw new Error('Order user not found');
  }

  let stWorkerId = null;
  if (createStretchCeilingOrderDto.stretchTextureOrder.stWorker !== "Աշխատակից") {
    const orderWorkerDocument = await this.stretchWorkerModel.findById(createStretchCeilingOrderDto.stretchTextureOrder.stWorker);
    if (!orderWorkerDocument) {
      throw new Error('Order worker not found');
    }
    stWorkerId = orderWorkerDocument.id;
  }

  const createdOrder: any = await this.stretchCeilingOrderModel.create({
    ...createStretchCeilingOrderDto.stretchTextureOrder,
    user: orderUserDocument.id,
    buyer: orderBuyerDocument.id,
    stWorker: stWorkerId,
  });

  orderUserDocument.order.push(createdOrder.id);
  orderBuyerDocument.order.push(createdOrder.id);

  await Promise.all([
    orderUserDocument.save(),
    orderBuyerDocument.save(),
  ]);

  if (stWorkerId) {
    const orderWorkerDocument = await this.stretchWorkerModel.findById(stWorkerId);
    orderWorkerDocument.order.push(createdOrder.id);
    await orderWorkerDocument.save();
  }

  await this.debetKreditService.create(
    createdOrder._id,
    orderUserDocument.id,
    orderBuyerDocument.id,
    createdOrder.balance,
    createdOrder.prepayment
  );

  
  return createdOrder;
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
      installDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("buyer").populate("stWorker").populate("user").sort({ date: -1 })
  }

  async filterOrderMaterial(startDate: Date, endDate: Date) {
    return await this.stretchCeilingOrderModel.find({
      installDate: {
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
    return await this.stretchCeilingOrderModel.findById(id).populate("buyer").populate("stWorker");
  }

  async update(id: string, updateStretchCeilingOrderDto: { balance: number, prepayment: number }, buyer: any, orderWorker: any, updatingOrder: UpdateStretchCeilingOrderDto) {

    const buyerCheck: {
      save(): any;
      order: [string];
      debetKredit: [string]
    } = await this.stretchBuyerModel.findOne(buyer._id);

    const debetKredit = await this.debetKreditService.findByOrder(id.toString())
    if (debetKredit.length === 0) {
      const debetKredit = await this.debetKreditService.create(id, updatingOrder.user.toString(), updatingOrder.buyer._id.toString(), updateStretchCeilingOrderDto.balance, updateStretchCeilingOrderDto.prepayment)
    } else {
      const debetSum: any = debetKredit.filter(e => e.type === "Գնում")
      await this.debetKreditService.updateBalance(updateStretchCeilingOrderDto.balance, debetSum[0]._id.toString())
      if (updatingOrder.buyer._id.toString() !== buyer._id.toString()) {
        await this.debetKreditService.updateBuyer(updatingOrder.buyer._id.toString(), buyer._id.toString())
        const debetKreditIdArr = []
        debetKredit.forEach(e => {
          debetKreditIdArr.push(e._id.toString())
        })
        await this.stretchBuyerService.removeDebetKreditFromBuyers(debetKreditIdArr)
        debetKreditIdArr.forEach(e => {
          buyerCheck.debetKredit.push(e);
        })
        await Promise.all([
          buyerCheck.save(),
        ]);
      }
    }


    let workerCheck
    if (orderWorker) {
      workerCheck = await this.stretchWorkerModel.findOne(orderWorker._id)
    }
    await this.stretchBuyerModel.findByIdAndUpdate(buyerCheck, { order: [...buyerCheck.order, id] });
    if (workerCheck) {
      await this.stretchWorkerModel.findByIdAndUpdate(workerCheck, { order: [...workerCheck.order, id] });
      const updatedOrder = await this.stretchCeilingOrderModel.findByIdAndUpdate(id, { ...updateStretchCeilingOrderDto, stWorker: orderWorker.id })
    }
    const updatedOrder = await this.stretchCeilingOrderModel.findByIdAndUpdate(id, { ...updateStretchCeilingOrderDto, buyer: buyer.id })

    return updatedOrder;
  }

  async updateStatus(id: string, status: string) {

    return await this.stretchCeilingOrderModel.findByIdAndUpdate(id, { status })
  }

  async updateStretchPayed(id: string) {
    return await this.stretchCeilingOrderModel.findByIdAndUpdate(id, { payed: true })
  }

  async remove(id: string) {
    try {
      const deletedOrder: any = await this.stretchCeilingOrderModel.findByIdAndDelete(id);

      await this.stretchBuyerService.deleteFromArray(deletedOrder.buyer.toString(), id);

      const debetKredit = await this.debetKreditService.findByOrder(id)

      if (debetKredit.length > 0) {
        const debetKreditIdArr: string[] = debetKredit.map(e => e._id.toString());
        await this.stretchBuyerService.removeDebetKreditFromBuyers(debetKreditIdArr);
        await this.debetKreditService.deleteDocuments(debetKreditIdArr);
      }

      return `This action removes a #${id} stretchCeilingOrder`;
    } catch (error) {
      throw new Error(`Failed to remove stretchCeilingOrder with id ${id}: ${error.message}`);
    }
  }

}
