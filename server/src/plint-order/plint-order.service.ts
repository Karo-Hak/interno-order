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
import { TelegramService } from '../telegram/telegram.service';


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
    private readonly telegramService: TelegramService,

    private readonly plintDebetKreditService: PlintDebetKreditService,
  ) { }

 async create(createPlintOrderDto: any) {
  const { buyer, user, plintOrder } = createPlintOrderDto;

  // Найти покупателя
  const orderBuyerDocument = await this.plintBuyerModel.findById(buyer);
  if (!orderBuyerDocument) throw new Error('Order buyer not found');

  // Найти кооперацию (если есть)
  let orderCoopDocument = null;
  if (plintOrder.coop) {
    orderCoopDocument = await this.plintCoopModel.findById(plintOrder.coop);
    if (!orderCoopDocument) throw new Error('Order coop not found');
  }

  // Найти пользователя
  const orderUserDocument = await this.userModel.findById(user.userId);
  if (!orderUserDocument) throw new Error('Order user not found');

  // Создать заказ
  const createdOrder: any = await this.plintOrderModel.create({
    ...plintOrder,
    user: orderUserDocument.id,
    buyer: orderBuyerDocument.id,
    coop: orderCoopDocument ? orderCoopDocument.id : null,
  });

  // Обновляем связи
  orderUserDocument.plintOrder.push(createdOrder.id);
  orderBuyerDocument.plintOrder.push(createdOrder.id);
  if (orderCoopDocument) orderCoopDocument.plintOrder.push(createdOrder.id);

  await Promise.all([
    orderUserDocument.save(),
    orderBuyerDocument.save(),
    orderCoopDocument?.save(),
  ]);

  // Создать дебет/кредит запись
  await this.plintDebetKreditService.create(
    createdOrder._id,
    orderUserDocument.id,
    orderBuyerDocument.id,
    createdOrder.balance,
    createdOrder.prepayment
  );

  // ======= Telegram уведомление в общий чат =======
  // Вместо перебора сотрудников, используем один общий chatId
  // В .env указать, например: TG_CHAT_ID_PLINT=-10011111111
  await this.telegramService.sendSectionNotification('plint', createdOrder);
  // ===============================================

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


  async update(
    id: string,
    updatePlintOrderDto: { balance: number; prepayment: number },
    buyer: any,
    updatePlintOrder: UpdatePlintOrderDto
  ) {
    try {
      if (!buyer || !buyer._id) {
        throw new Error('Buyer is required');
      }

      const buyerDocument = await this.plintBuyerModel.findOne(buyer._id);
      if (!buyerDocument) {
        throw new Error('Buyer not found');
      }

      const debetKreditRecords = await this.plintDebetKreditService.findByOrder(id.toString());

      if (debetKreditRecords.length === 0) {
        await this.plintDebetKreditService.create(
          id,
          updatePlintOrder.user.toString(),
          updatePlintOrder.buyer?._id?.toString() || null,
          updatePlintOrderDto.balance,
          updatePlintOrderDto.prepayment
        );
      } else {
        const debetRecord = debetKreditRecords.find((e) => e.type === 'Գնում');
        if (debetRecord) {
          await this.plintDebetKreditService.updateBalance(updatePlintOrderDto.balance, debetRecord._id.toString());
        }

        if (updatePlintOrder.buyer?._id?.toString() !== buyer._id.toString()) {
          await this.plintDebetKreditService.updateBuyer(
            updatePlintOrder.buyer?._id?.toString() || null,
            buyer._id.toString()
          );

          const debetKreditIds = debetKreditRecords.map((e) => e._id.toString());
          await this.plintBuyerService.removeDebetKreditFromBuyers(debetKreditIds);

          debetKreditIds.forEach((id: any) => {
            buyerDocument.debetKredit.push(id);
          });

          await buyerDocument.save();
        }
      }

      const updatedOrder = await this.plintOrderModel.findByIdAndUpdate(
        id,
        {
          ...updatePlintOrderDto,
          buyer: buyer.id,
          coop: updatePlintOrder?.coop || null,
        },
        { new: true }
      );

      if (!updatedOrder) {
        throw new Error('Order not found');
      }

      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error.message);
      throw new Error(`Failed to update order: ${error.message}`);
    }
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




  remove(id: number) {
    return `This action removes a #${id} coopCeilingOrder`;
  }
}
