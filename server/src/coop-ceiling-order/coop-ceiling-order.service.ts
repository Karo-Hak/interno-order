import { Injectable } from '@nestjs/common';
import { CreateCoopCeilingOrderDto } from './dto/create-coop-ceiling-order.dto';
import { UpdateCoopCeilingOrderDto } from './dto/update-coop-ceiling-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { StretchBuyer } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { CoopCeilingOrder } from './schema/coop-ceiling-order.schema';
import { CoopCeilingOrderModule } from './coop-ceiling-order.module';
import { CoopStretchBuyerModule } from 'src/coop-stretch-buyer/coop-stretch-buyer.module';
import { CoopStretchBuyer } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { CoopStretchBuyerService } from 'src/coop-stretch-buyer/coop-stretch-buyer.service';
import { CoopDebetKreditService } from 'src/coop-debet-kredit/coop-debet-kredit.service';

@Injectable()
export class CoopCeilingOrderService {
  constructor(
    @InjectModel(CoopCeilingOrder.name) private coopCeilingOrderModel: Model<CoopCeilingOrder>,
    @InjectModel(CoopStretchBuyer.name) private coopStretchBuyerModel: Model<CoopStretchBuyer>,
    @InjectModel('User') private userModel: Model<User>,

    private readonly coopStretchBuyerService: CoopStretchBuyerService,
    private readonly userService: UserService,
    private readonly coopDebetKreditService: CoopDebetKreditService,
  ) { }

  async create(createCoopCeilingOrderDto: any) {

    const { buyer, user } = createCoopCeilingOrderDto;
    const orderBuyerDocument = await this.coopStretchBuyerModel.findById(buyer);
    if (!orderBuyerDocument) {
      throw new Error('Order buyer not found');
    }

    const orderUserDocument = await this.userModel.findById(user.userId);
    if (!orderUserDocument) {
      throw new Error('Order user not found');
    }

    const createdOrder: any = await this.coopCeilingOrderModel.create({
      ...createCoopCeilingOrderDto.stretchTextureOrder,
      user: orderUserDocument.id,
      buyer: orderBuyerDocument.id,
    });

    orderUserDocument.coopCeilingOrder.push(createdOrder.id);
    orderBuyerDocument.coopCeilingOrder.push(createdOrder.id);

    await Promise.all([
      orderUserDocument.save(),
      orderBuyerDocument.save(),
    ]);

    const debetKredit = await this.coopDebetKreditService.create(createdOrder._id, orderUserDocument.id, orderBuyerDocument.id, createdOrder.balance, createdOrder.prepayment)

    return createdOrder;
  }

  async filterOrder(startDate: Date, endDate: Date) {
    return await this.coopCeilingOrderModel.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate("buyer").populate("user").sort({ date: -1 })
  }

  async findOne(id: string) {
    const data = (await this.coopCeilingOrderModel.findById(id).populate("buyer"))
    return data
  }

  findAll() {
    return `This action returns all coopCeilingOrder`;
  }



  update(id: number, updateCoopCeilingOrderDto: UpdateCoopCeilingOrderDto) {
    return `This action updates a #${id} coopCeilingOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} coopCeilingOrder`;
  }
}
