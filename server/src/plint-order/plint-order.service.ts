import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { PlintOrder } from './schema/plint-order.schema';
import { PlintBuyer } from 'src/plintBuyer/schema/plint-buyer.schema';
import { UpdatePlintOrderDto } from './dto/update-plint-order.dto';
import { PlintBuyerService } from 'src/plintBuyer/plint-buyer.service';
import { PlintDebetKreditService } from 'src/plint-debet-kredit/plint-debet-kredit.service';
import { PlintProduct } from 'src/plint-product/schema/plint-product.schema';
import { PlintCoop } from 'src/plint-coop/schema/plint-coop.schema';

@Injectable()
export class PlintOrderService {
  constructor(
    @InjectModel(PlintOrder.name) private plintOrderModel: Model<PlintOrder>,
    @InjectModel(PlintBuyer.name) private plintBuyerModel: Model<PlintBuyer>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel(PlintProduct.name) private plintProductModel: Model<PlintProduct>,
    @InjectModel(PlintCoop.name) private plintCoopModel: Model<PlintCoop>,

    private readonly plintBuyerService: PlintBuyerService,
    private readonly userService: UserService,
    private readonly plintDebetKreditService: PlintDebetKreditService,
  ) { }

  async create(createPlintOrderDto: any) {

    const { buyer, user } = createPlintOrderDto;
    const orderBuyerDocument = await this.plintBuyerModel.findById(buyer);
    if (!orderBuyerDocument) {
      throw new Error('Order buyer not found');
    }
    const orderCoopDocument = await this.plintCoopModel.findById(createPlintOrderDto.plintOrder.coop);
    if (!orderCoopDocument) {
      throw new Error('Order buyer not found');
    }

    const orderUserDocument = await this.userModel.findById(user.userId);
    if (!orderUserDocument) {
      throw new Error('Order user not found');
    }

    const createdOrder: any = await this.plintOrderModel.create({
      ...createPlintOrderDto.plintOrder,
      user: orderUserDocument.id,
      buyer: orderBuyerDocument.id,
      coop: orderCoopDocument.id
    });

    orderUserDocument.plintOrder.push(createdOrder.id);
    orderBuyerDocument.plintOrder.push(createdOrder.id);
    orderCoopDocument.plintOrder.push(createdOrder.id);

    await Promise.all([
      orderUserDocument.save(),
      orderBuyerDocument.save(),
      orderCoopDocument.save(),
    ]);

    const debetKredit = await this.plintDebetKreditService.create(createdOrder._id, orderUserDocument.id, orderBuyerDocument.id, createdOrder.balance, createdOrder.prepayment)

    return createdOrder;
  }

  async findNewOrders() {
    return await this.plintOrderModel.find({ done: false, }).populate("buyer").sort({ date: -1 })
  }

  async filterOrder(startDate: Date, endDate: Date) {
    return await this.plintOrderModel.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("buyer").populate("user").sort({ date: -1 })
  }

  async findOne(id: string) {
    const data = (await this.plintOrderModel.findById(id).populate("buyer").populate("coop"))
    return data
  }

  async updateStatus(id: string) {
    return await this.plintOrderModel.findByIdAndUpdate(id, { done: true })
  }

  findAll() {
    return `This action returns all coopCeilingOrder`;
  }



  update(id: string, updatePlintOrderDto: UpdatePlintOrderDto) {
    return `This action updates a #${id} coopCeilingOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} coopCeilingOrder`;
  }
}
