import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { StretchCeilingOrder } from './schema/stretch-ceiling-order.schema';
import { StretchBuyer } from 'src/stretch-buyer/schema/stretch-buyer.schema';
import { User } from 'src/user/schema/user.schema';
import { StretchWorker } from 'src/stretch-worker/schema/stretch-worker.schema';
import { DebetKreditService } from 'src/debet-kredit/debet-kredit.service';
import { StretchBuyerService } from 'src/stretch-buyer/stretch-buyer.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StretchCeilingOrderService {
  constructor(
    @InjectModel(StretchCeilingOrder.name)
    private readonly stretchCeilingOrderModel: Model<StretchCeilingOrder>,

    @InjectModel(StretchBuyer.name)
    private readonly stretchBuyerModel: Model<StretchBuyer>,

    @InjectModel(StretchWorker.name)
    private readonly stretchWorkerModel: Model<StretchWorker>,

    @InjectModel('User')
    private readonly userModel: Model<User>,

    @InjectConnection() // ⬅️ добавлено: подключение mongoose
    private readonly connection: Connection,

    private readonly debetKreditService: DebetKreditService,
    private readonly stretchBuyerService: StretchBuyerService,
    private readonly userService: UserService,
  ) { }

  private toNum(v: any, d = 0): number {
    return v === '' || v == null ? d : Number(v);
  }

  private idOf(v: any): string {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (v._id) return v._id.toString();
    if (v.id) return v.id.toString();
    return String(v);
  }

  async create(createStretchCeilingOrderDto: any) {
    const { orderBuyer, user } = createStretchCeilingOrderDto;

    // buyer может прийти объектом — достанем id
    const buyerId = this.idOf(orderBuyer);
    const orderBuyerDocument = await this.stretchBuyerModel.findById(buyerId).exec();
    if (!orderBuyerDocument) {
      throw new Error('Order buyer not found');
    }

    const orderUserDocument = await this.userModel.findById(user.userId).exec();
    if (!orderUserDocument) {
      throw new Error('Order user not found');
    }

    // worker опционально
    let stWorker: string | null = null;
    const rawWorkerId = createStretchCeilingOrderDto?.stretchTextureOrder?.stWorkerId;
    if (rawWorkerId && rawWorkerId !== 'Աշխատակից') {
      const orderWorkerDocument = await this.stretchWorkerModel.findById(rawWorkerId).exec();
      if (!orderWorkerDocument) {
        throw new Error('Order worker not found');
      }
      stWorker = orderWorkerDocument._id.toString();
    }

    // нормализуем числовые поля
    const patch = {
      ...createStretchCeilingOrderDto.stretchTextureOrder,
      balance: this.toNum(createStretchCeilingOrderDto.stretchTextureOrder?.balance, 0),
      prepayment: this.toNum(createStretchCeilingOrderDto.stretchTextureOrder?.prepayment, 0),
      salary: this.toNum(createStretchCeilingOrderDto.stretchTextureOrder?.salary, 0),
    };

    const createdOrder: any = await this.stretchCeilingOrderModel.create({
      ...patch,
      user: orderUserDocument._id,
      buyer: orderBuyerDocument._id,
      stWorker: stWorker,
    });

    // привязки без дублей
    const tasks: Promise<any>[] = [
      this.userModel
        .updateOne({ _id: orderUserDocument._id }, { $addToSet: { order: createdOrder._id } })
        .exec(),
      this.stretchBuyerModel
        .updateOne({ _id: orderBuyerDocument._id }, { $addToSet: { order: createdOrder._id } })
        .exec(),
    ];
    if (stWorker) {
      tasks.push(
        this.stretchWorkerModel
          .updateOne({ _id: stWorker }, { $addToSet: { order: createdOrder._id } })
          .exec(),
      );
    }
    await Promise.all(tasks);

    // DK
    await this.debetKreditService.create(
      createdOrder._id,
      orderUserDocument._id,
      orderBuyerDocument._id,
      createdOrder.balance,
      createdOrder.prepayment,
    );

    // buyer.buy / buyer.credit (без завязки кредитов на заказ)
    await this.stretchBuyerService.upsertBuyMergeSum(orderBuyerDocument._id.toString(), {
      date: new Date(),
      sum: Number(createdOrder.balance) || 0,
      orderId: createdOrder._id.toString(),
    });
    await this.stretchBuyerService.addCreditIfNotExists(orderBuyerDocument._id.toString(), {
      date: new Date(),
      sum: Number(createdOrder.prepayment) || 0,
      orderId: createdOrder._id.toString(),
    });

    return createdOrder;
  }

  async findNewOrders() {
    return await this.stretchCeilingOrderModel
      .find({ status: 'progress' })
      .populate('buyer')
      .sort({ date: -1 })
      .lean()
      .exec();
  }

  async findMesurOrders() {
    return await this.stretchCeilingOrderModel
      .find({ status: 'measurement' })
      .populate('buyer')
      .sort({ date: -1 })
      .lean()
      .exec();
  }

  async findInstalOrders() {
    return await this.stretchCeilingOrderModel
      .find({ status: 'installation' })
      .populate('buyer')
      .sort({ date: -1 })
      .lean()
      .exec();
  }

  async filterOrder(startDate: Date, endDate: Date) {
    return await this.stretchCeilingOrderModel
      .find({ installDate: { $gte: startDate, $lte: endDate } })
      .populate('buyer')
      .populate('stWorker')
      .populate('user')
      .sort({ date: -1 })
      .lean()
      .exec();
  }

  async filterOrderMaterial(startDate: Date, endDate: Date) {
    return await this.stretchCeilingOrderModel
      .find({ installDate: { $gte: startDate, $lte: endDate }, status: 'dane' })
      .populate('buyer')
      .populate('stWorker')
      .populate('user')
      .sort({ date: -1 })
      .lean()
      .exec();
  }

  async findAll() {
    return await this.stretchCeilingOrderModel.find().lean().exec();
  }

  async findOne(id: string) {
    return await this.stretchCeilingOrderModel
      .findById(id)
      .populate('buyer')
      .populate('stWorker')
      .lean()
      .exec();
  }

  async update(
    id: string,
    updateStretchCeilingOrderDto: { balance: number; prepayment: number } & Record<string, any>,
    buyer: any,
    orderWorker: any | undefined,
    updatingOrder: any, // популяченный findOne(id)
  ) {
    // проверить покупателя
    const buyerCheck: any = await this.stretchBuyerModel.findById(buyer._id).exec();
    if (!buyerCheck) {
      throw new Error('Buyer not found for update');
    }

    // Debet/Kredit
    const dk = await this.debetKreditService.findByOrder(id.toString());
    if (dk.length === 0) {
      await this.debetKreditService.create(
        id,
        updatingOrder.user.toString(), // user — ObjectId в текущем методе
        buyer._id.toString(),
        this.toNum(updateStretchCeilingOrderDto.balance, 0),
        this.toNum(updateStretchCeilingOrderDto.prepayment, 0),
      );
    } else {
      const debetDoc = dk.find((e: any) => e.type === 'Գնում');
      if (debetDoc) {
        await this.debetKreditService.updateBalance(
          this.toNum(updateStretchCeilingOrderDto.balance, 0),
          debetDoc._id.toString(),
        );
      }
      // перенос DK на нового покупателя
      if (updatingOrder?.buyer?._id && updatingOrder.buyer._id.toString() !== buyer._id.toString()) {
        await this.debetKreditService.updateBuyer(updatingOrder.buyer._id.toString(), buyer._id.toString());
        const dkIds = dk.map((e: any) => e._id.toString());
        await this.stretchBuyerService.removeDebetKreditFromBuyers(dkIds);
        dkIds.forEach((e: string) => buyerCheck.debetKredit.push(e));
        await buyerCheck.save();
      }
    }

    // привязка заказа к новому buyer
    await this.stretchBuyerModel.updateOne(
      { _id: buyerCheck._id },
      { $addToSet: { order: id } },
    );

    // обработка работника
    let stWorkerUpdate: any = {};
    if (orderWorker) {
      await this.stretchWorkerModel.updateOne(
        { _id: orderWorker._id },
        { $addToSet: { order: id } },
      );
      stWorkerUpdate.stWorker = orderWorker._id;
    } else {
      stWorkerUpdate.stWorker = null;
    }

    // обновление заказа
    const patch = {
      ...updateStretchCeilingOrderDto,
      balance: this.toNum(updateStretchCeilingOrderDto.balance, 0),
      prepayment: this.toNum(updateStretchCeilingOrderDto.prepayment, 0),
      buyer: buyer._id,
      ...stWorkerUpdate,
    };

    const updatedOrder = await this.stretchCeilingOrderModel
      .findByIdAndUpdate(id, patch, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new Error('Order not found on update');
    }

    // Жёстко выставить сумму buy для этого заказа + скорректировать totalSum
    await this.stretchBuyerService.setBuySumForOrder(
      buyer._id.toString(),
      updatedOrder._id.toString(),
      this.toNum(updatedOrder.balance, 0),
    );

    const oldBuyerId = updatingOrder?.buyer?._id?.toString();
    const newBuyerId = buyer._id.toString();
    const oldBalance = Number(updatingOrder?.balance) || 0;
    const oldPrepay = Number(updatingOrder?.prepayment) || 0;
    const newBalance = this.toNum(updateStretchCeilingOrderDto.balance, 0);
    const newPrepay = this.toNum(updateStretchCeilingOrderDto.prepayment, 0);
    const orderDate = (updatedOrder as any).date;

    if (oldBuyerId && oldBuyerId !== newBuyerId) {
      // убрать у старого покупателя
      await this.stretchBuyerService.removeOneBuyByOrderIdAndDecTotal(oldBuyerId, id, oldBalance);
      if (oldPrepay > 0) {
        const session = await this.connection.startSession();
        await session.withTransaction(async () => {
          let res = await this.stretchBuyerService.removeOneCreditByCriteriaAndIncTotal(
            oldBuyerId,
            { sum: oldPrepay, date: orderDate, matchBy: 'minute' },
            { session }
          );

          if (!res.removed) {
            res = await this.stretchBuyerService.removeOneCreditByCriteriaAndIncTotal(
              oldBuyerId,
              { sum: oldPrepay, date: orderDate, matchBy: 'hour' },
              { session }
            );
          }
          if (!res.removed) {
            await this.stretchBuyerService.removeOneCreditByCriteriaAndIncTotal(
              oldBuyerId,
              { sum: oldPrepay, date: orderDate, matchBy: 'day' },
              { session }
            );
          }

        });

      }

      // добавить/обновить у нового покупателя
      await this.stretchBuyerService.upsertBuyMergeSum(newBuyerId, {
        date: orderDate,
        sum: newBalance,
        orderId: updatedOrder._id.toString(),
      });
      if (newPrepay > 0) {
        await this.stretchBuyerService.addCreditIfNotExists(newBuyerId, {
          date: new Date(),
          sum: newPrepay,
          orderId: updatedOrder._id.toString(),
        });
      }
    }

    return updatedOrder;
  }

  async updateStatus(id: string, status: string) {
    return await this.stretchCeilingOrderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async updateStretchPayed(id: string) {
    return await this.stretchCeilingOrderModel
      .findByIdAndUpdate(id, { payed: true }, { new: true })
      .exec();
  }

  // === УДАЛЕНИЕ С ТРАНЗАКЦИЕЙ ===
  async remove(id: string) {
    const session = await this.connection.startSession(); // ⬅️ теперь поле есть
    try {
      let message = '';
      await session.withTransaction(async () => {
        const order: any = await this.stretchCeilingOrderModel.findById(id).session(session);
        if (!order) throw new NotFoundException(`Order ${id} not found`);

        const buyerId = order.buyer.toString();

        // 1) удалить заказ
        await this.stretchCeilingOrderModel.deleteOne({ _id: id }).session(session);

        // 2) убрать ссылку на заказ у покупателя
        await this.stretchBuyerService.deleteFromArray(buyerId, id, { session });

        // 3) buy: удалить ровно один buy по orderId и totalSum -= balance
        const balance = Number(order.balance) || 0;
        await this.stretchBuyerService.removeOneBuyByOrderIdAndDecTotal(buyerId, id, balance, { session });

        // 4) credit: удалить ровно один credit по сумме предоплаты и дате (без привязки к заказу)
        const preSum = Number(order.prepayment) || 0;
        if (preSum > 0) {
          const creditDate = order.prepaymentDate ?? order.createdAt ?? order.date;
          // сначала узкий интервал (минута), с метками
          let res = await this.stretchBuyerService.removeOneCreditByCriteriaAndIncTotal(
            buyerId,
            { sum: preSum, date: creditDate, matchBy: 'minute' },
            { session }
          );

          if (!res.removed) {
            res = await this.stretchBuyerService.removeOneCreditByCriteriaAndIncTotal(
              buyerId,
              { sum: preSum, date: creditDate, matchBy: 'hour' },
              { session }
            );
          }
          if (!res.removed) {
            await this.stretchBuyerService.removeOneCreditByCriteriaAndIncTotal(
              buyerId,
              { sum: preSum, date: creditDate, matchBy: 'day' },
              { session }
            );
          }

        }

        // 5) DebetKredit, связанные с заказом
        const dk = await this.debetKreditService.findByOrder(id, { session });
        if (dk.length > 0) {
          const dkIds = dk.map((e: any) => e._id.toString());
          await this.stretchBuyerService.removeDebetKreditFromBuyers(dkIds, { session });
          await this.debetKreditService.deleteDocuments(dkIds, { session });
        }

        message = `This action removes a #${id} stretchCeilingOrder`;
      });

      return message;
    } finally {
      await session.endSession();
    }
  }
}
