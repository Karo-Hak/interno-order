import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { StretchBuyer } from './schema/stretch-buyer.schema';

type ServiceOptions = { session?: ClientSession };
type IdLike = string | Types.ObjectId;

@Injectable()
export class StretchBuyerService {
  constructor(
    @InjectModel(StretchBuyer.name)
    private stretchBuyerModel: Model<StretchBuyer>,
    
    @InjectConnection()
    private readonly connection: Connection,
  ) { }

  // + session?
  create(createStretchBuyerDto: any, session?: ClientSession) {
    const createdBuyer = new this.stretchBuyerModel(createStretchBuyerDto);
    return createdBuyer.save({ session });
  }

  async findAll() {
    return await this.stretchBuyerModel.find();
  }

  // + session?
  async findByPhoneAndName(phone: string, name: string, session?: ClientSession) {
    return await this.stretchBuyerModel
      .findOne({ $and: [{ buyerPhone1: phone }, { buyerName: name }] })
      .session(session ?? null);
  }

  // + session?
  async findByPhone(phone: string, session?: ClientSession) {
    return await this.stretchBuyerModel
      .findOne({ buyerPhone1: phone })
      .session(session ?? null);
  }

  async findOne(id: string) {
    return await this.stretchBuyerModel.findById(id);
  }

  async deleteFromArray(
    buyerId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    options?: ServiceOptions
  ): Promise<{ modified: boolean; modifiedCount: number }> {
    const session = options?.session;

    const buyerObjectId =
      buyerId instanceof Types.ObjectId ? buyerId : new Types.ObjectId(buyerId);

    const orderObjectId =
      orderId instanceof Types.ObjectId ? orderId : new Types.ObjectId(orderId);

    const res = await this.stretchBuyerModel.updateOne(
      { _id: buyerObjectId },
      { $pull: { order: orderObjectId } },
      { session }
    );

    return { modified: res.modifiedCount > 0, modifiedCount: res.modifiedCount ?? 0 };
  }

  async removeDebetKreditFromBuyers(
    debetKreditIds: string[],
    options?: ServiceOptions
  ) {
    const session = options?.session;

    // Приведём к ObjectId и оставим и строковые, и ObjectId варианты на всякий случай
    const asObjectIds = debetKreditIds.map((id) => new Types.ObjectId(id));
    const idsForIn = [...asObjectIds, ...debetKreditIds];

    // Фильтруем только тех, у кого реально есть эти id — так запрос дешевле
    return this.stretchBuyerModel.updateMany(
      { debetKredit: { $in: idsForIn } },
      { $pull: { debetKredit: { $in: idsForIn } } },
      { session }
    );
  }

  async addBuy(
    buyerId: string,
    payload: { date: Date; sum: number; orderId: IdLike },
    session?: ClientSession,
  ) {
    const _orderId = new Types.ObjectId(payload.orderId);
    const newSum = Number(payload.sum) || 0;

    // 1) Проверяем, есть ли уже buy по этому orderId и читаем текущее значение
    const existing = await this.stretchBuyerModel
      .findOne(
        { _id: buyerId, 'buy.orderId': _orderId },
        { 'buy.$': 1 },                     // вернёт только совпавший элемент
      )
      .lean()
      .session(session ?? null);

    if (existing?.buy?.length) {
      // 2) Было — ЗАМЕНЯЕМ сумму (не инкрементим) и двигаем totalSum на дельту
      const prev = Number(existing.buy[0].sum) || 0;
      const delta = newSum - prev;

      const upd = await this.stretchBuyerModel.updateOne(
        { _id: buyerId, 'buy.orderId': _orderId },
        {
          $set: { 'buy.$.sum': newSum, 'buy.$.date': payload.date },
          $inc: { totalSum: delta },
        },
        { session },
      );

      return { action: 'replaced' as const, modified: upd.modifiedCount === 1, delta };
    }

    // 3) Не было — вставляем новую запись и увеличиваем totalSum на newSum
    const ins = await this.stretchBuyerModel.updateOne(
      { _id: buyerId, 'buy.orderId': { $ne: _orderId } },
      {
        $push: { buy: { date: payload.date, sum: newSum, orderId: _orderId } },
        $inc: { totalSum: newSum },
      },
      { session },
    );

    return { action: ins.modifiedCount === 1 ? 'inserted' as const : 'noop' as const };
  }

  async addCredit(
    buyerId: string,
    payload: { date: Date; sum: number, orderId: IdLike },
    session?: ClientSession,
  ) {
    const res = await this.stretchBuyerModel.updateOne(
      { _id: buyerId, credit: { $not: { $elemMatch: { date: payload.date, sum: payload.sum, orderId: payload.orderId } } } },
      {
        $push: { credit: { date: payload.date, sum: payload.sum, orderId: payload.orderId } },
        $inc: { totalSum: -payload.sum },
      },
      { session },
    );
    return res.modifiedCount === 1;
  }

  async removeOneBuyByOrderIdAndDecTotal(
    buyerId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    amount: number,
    options?: ServiceOptions
  ): Promise<{ removed: boolean; step1?: number; step2?: number }> {
    const session = options?.session;

    const buyerObjectId =
      buyerId instanceof Types.ObjectId ? buyerId : new Types.ObjectId(buyerId);

    const orderObjectId =
      orderId instanceof Types.ObjectId ? orderId : new Types.ObjectId(orderId);

    const dec = Math.abs(Number(amount) || 0);

    // Шаг 1: пометить ПЕРВЫЙ подходящий элемент buy как null + скорректировать totalSum
    // Если в старых данных orderId мог быть строкой, матчим и по строке, и по ObjectId.
    const step1 = await this.stretchBuyerModel.updateOne(
      {
        _id: buyerObjectId,
        buy: {
          $elemMatch: {
            orderId: { $in: [orderObjectId, String(orderObjectId)] },
          },
        },
      },
      { $unset: { 'buy.$': 1 }, $inc: { totalSum: -dec } },
      { session }
    );

    if (step1.modifiedCount === 0) return { removed: false };

    // Шаг 2: вычистить null из массива
    const step2 = await this.stretchBuyerModel.updateOne(
      { _id: buyerObjectId },
      { $pull: { buy: null } },
      { session }
    );

    return { removed: step2.modifiedCount > 0, step1: step1.modifiedCount, step2: step2.modifiedCount };
  }

  // Удалить ровно ОДНУ запись из credit по сумме И дате (первую подходящую)
  // buyer.credit: [{ _id, sum: number, date: Date, source?: 'prepayment'|'manual'|'other', createdBy?: ObjectId, ... }]

  async removeOneCredit(
    buyerId: string | Types.ObjectId,
    criteria: {
      sum: number;
      date: Date | string;
      orderId: string | Types.ObjectId;                 // ⬅️ обязательно передаём orderId
      matchBy?: 'exact' | 'minute' | 'hour' | 'day';
    },
    options?: ServiceOptions
  ): Promise<{ removed: boolean; step1?: number; step2?: number }> {
    const session = options?.session;

    // 1) сумма должна быть > 0
    const sumNum = Number(criteria.sum);
    if (!Number.isFinite(sumNum) || sumNum <= 0) return { removed: false };

    // 2) buyerId → ObjectId
    const buyerObjectId =
      buyerId instanceof Types.ObjectId ? buyerId : new Types.ObjectId(buyerId);

    // 3) orderId → ObjectId (обязателен)
    if (!criteria.orderId) {
      throw new Error('orderId is required for credit removal');
    }
    const orderObjectId =
      criteria.orderId instanceof Types.ObjectId
        ? criteria.orderId
        : new Types.ObjectId(criteria.orderId);

    // 4) дата → валидный Date
    const baseDate =
      typeof criteria.date === 'string' ? new Date(criteria.date) : criteria.date;
    if (!(baseDate instanceof Date) || Number.isNaN(baseDate.getTime())) {
      throw new Error('Invalid date for credit removal');
    }

    // 5) интервал даты по matchBy
    const matchBy = criteria.matchBy ?? 'day';
    let dateCond: any;
    if (matchBy === 'exact') {
      dateCond = baseDate;
    } else if (matchBy === 'minute') {
      const start = new Date(baseDate); start.setSeconds(0, 0);
      const end = new Date(baseDate); end.setSeconds(59, 999);
      dateCond = { $gte: start, $lte: end };
    } else if (matchBy === 'hour') {
      const start = new Date(baseDate); start.setMinutes(0, 0, 0);
      const end = new Date(baseDate); end.setMinutes(59, 59, 999);
      dateCond = { $gte: start, $lte: end };
    } else {
      const start = new Date(baseDate); start.setHours(0, 0, 0, 0);
      const end = new Date(baseDate); end.setHours(23, 59, 59, 999);
      dateCond = { $gte: start, $lte: end };
    }

    // 6) матчим один элемент credit по sum + dateCond + orderId
    const elemMatch = { sum: sumNum, date: dateCond, orderId: orderObjectId };

    // Шаг 1: пометить ПЕРВЫЙ совпавший элемент как null + totalSum += sum
    const step1 = await this.stretchBuyerModel.updateOne(
      { _id: buyerObjectId, credit: { $elemMatch: elemMatch } },
      { $unset: { 'credit.$': 1 }, $inc: { totalSum: sumNum } },
      { session }
    );

    if ((step1 as any).modifiedCount === 0) return { removed: false };

    // Шаг 2: удалить null из массива
    const step2 = await this.stretchBuyerModel.updateOne(
      { _id: buyerObjectId },
      { $pull: { credit: null } },
      { session }
    );

    return {
      removed: (step2 as any).modifiedCount > 0,
      step1: (step1 as any).modifiedCount,
      step2: (step2 as any).modifiedCount,
    };
  }

  async setBuySumForOrder(buyerId: string, orderId: string, newSum: number) {
    const _orderId = new Types.ObjectId(orderId);

    // найдём текущую сумму, чтобы корректно сдвинуть totalSum
    const doc = await this.stretchBuyerModel.findOne(
      { _id: buyerId, 'buy.orderId': _orderId },
      { 'buy.$': 1, totalSum: 1 },
    );
    const current = doc?.buy?.[0]?.sum ?? 0;
    const delta = Number(newSum) - Number(current);

    const res = await this.stretchBuyerModel.updateOne(
      { _id: buyerId, 'buy.orderId': _orderId },
      { $set: { 'buy.$.sum': Number(newSum) }, $inc: { totalSum: delta } },
    );

    return { updated: res.modifiedCount === 1, delta };
  }

  async deleteCreditTx(buyerId: string, amount: number, date: Date, orderId: IdLike) {
    const session = await this.connection.startSession();

    try {
      let removed = false;
      await session.withTransaction(async () => {
        let r = await this.removeOneCredit(buyerId, { sum: amount, date, matchBy: 'minute', orderId }, { session });
        if (!r.removed) r = await this.removeOneCredit(buyerId, { sum: amount, date, matchBy: 'hour', orderId }, { session });
        if (!r.removed) r = await this.removeOneCredit(buyerId, { sum: amount, date, matchBy: 'day', orderId }, { session });
        removed = r.removed;

      });
      return { removed };
    } finally {
      await session.endSession();
    }

  }
}