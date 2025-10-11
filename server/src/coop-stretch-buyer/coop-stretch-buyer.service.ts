import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { CoopStretchBuyer } from './schema/coop-stretch-buyer.schema';

type ServiceOptions = { session?: ClientSession };

@Injectable()
export class CoopStretchBuyerService {
  constructor(
    @InjectModel(CoopStretchBuyer.name)
    private readonly coopBuyerModel: Model<CoopStretchBuyer>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  // ───────────────────────── helpers
  private asObjectId(v: string | Types.ObjectId): Types.ObjectId {
    return v instanceof Types.ObjectId ? v : new Types.ObjectId(v);
  }

  // ───────────────────────── CRUD / queries
  async create(dto: any, session?: ClientSession) {
    const doc = new this.coopBuyerModel(dto);
    return doc.save({ session });
  }

  // add into CoopStretchBuyerService
async resolveBuyer(
  b: { buyerId?: string; phone1?: string; name?: string; phone2?: string; region?: string; address?: string },
  options?: { session?: ClientSession }
): Promise<string> {
  const session = options?.session;
  if (b.buyerId) return b.buyerId;

  if (b.phone1) {
    const found = await this.findByPhone(b.phone1, session);
    if (found) return (found as any)._id.toString();
  }
  const created = await this.create(
    {
      name: b.name ?? 'Без названия',
      phone1: b.phone1 ?? '',
      phone2: b.phone2 ?? '',
      region: b.region ?? '',
      address: b.address ?? '',
    },
    session
  );
  return (created as any)._id.toString();
}


  async findAll() {
    return this.coopBuyerModel.find().lean().exec();
  }

  async findOne(id: string) {
    const doc = await this.coopBuyerModel.findById(id).lean().exec();
    if (!doc) throw new NotFoundException('Buyer not found');
    return doc;
  }

  async findByPhone(phone1: string, session?: ClientSession) {
    return this.coopBuyerModel.findOne({ phone1 }).session(session ?? null).lean().exec();
  }

  // ───────────────────────── arrays ops
  async deleteFromOrderArray(
    buyerId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    options?: ServiceOptions,
  ): Promise<{ modified: boolean; modifiedCount: number }> {
    const session = options?.session;
    const _buyerId = this.asObjectId(buyerId);
    const _orderId = this.asObjectId(orderId);

    const res = await this.coopBuyerModel.updateOne(
      { _id: _buyerId },
      { $pull: { order: _orderId } },
      { session },
    );

    return { modified: (res.modifiedCount ?? 0) > 0, modifiedCount: res.modifiedCount ?? 0 };
  }

  /**
   * Вставить/обновить покупку (buy) по конкретному orderId.
   * Если запись уже была — заменяем сумму и корректируем totalSum на дельту.
   * Если не было — вставляем и увеличиваем totalSum на сумму.
   */
  async upsertBuyMergeSum(
    buyerId: string | Types.ObjectId,
    payload: { date: Date; sum: number; orderId: string | Types.ObjectId },
    options?: ServiceOptions,
  ) {
    const session = options?.session;
    const _buyerId = this.asObjectId(buyerId);
    const _orderId = this.asObjectId(payload.orderId);
    const newSum = Number(payload.sum) || 0;

    // Найти существующую запись для orderId
    const existing = await this.coopBuyerModel
      .findOne({ _id: _buyerId, 'buy.orderId': _orderId }, { 'buy.$': 1 })
      .session(session ?? null)
      .lean()
      .exec();

    if (existing?.buy?.length) {
      const prev = Number(existing.buy[0].sum) || 0;
      const delta = newSum - prev;

      const upd = await this.coopBuyerModel.updateOne(
        { _id: _buyerId, 'buy.orderId': _orderId },
        { $set: { 'buy.$.sum': newSum, 'buy.$.date': payload.date }, $inc: { totalSum: delta } },
        { session },
      );

      return { action: 'replaced' as const, modified: upd.modifiedCount === 1, delta };
    }

    // Вставка новой записи
    const ins = await this.coopBuyerModel.updateOne(
      { _id: _buyerId, 'buy.orderId': { $ne: _orderId } },
      {
        $push: { buy: { date: payload.date, sum: newSum, orderId: _orderId } },
        $inc: { totalSum: newSum },
      },
      { session },
    );

    return { action: ins.modifiedCount === 1 ? ('inserted' as const) : ('noop' as const) };
  }

  /**
   * Добавить кредит (оплату), если точная запись (date+sum) отсутствует.
   * Уменьшаем totalSum на сумму оплаты.
   */
  async addCreditIfNotExists(
    buyerId: string | Types.ObjectId,
    payload: { date: Date; sum: number },
    options?: ServiceOptions,
  ) {
    const session = options?.session;
    const _buyerId = this.asObjectId(buyerId);

    const res = await this.coopBuyerModel.updateOne(
      { _id: _buyerId, credit: { $not: { $elemMatch: { date: payload.date, sum: payload.sum } } } },
      { $push: { credit: { date: payload.date, sum: payload.sum } }, $inc: { totalSum: -Number(payload.sum || 0) } },
      { session },
    );

    return res.modifiedCount === 1;
  }

  /**
   * Удалить ровно одну запись buy по orderId, уменьшив totalSum на amount.
   */
  async removeOneBuyByOrderIdAndDecTotal(
    buyerId: string | Types.ObjectId,
    orderId: string | Types.ObjectId,
    amount: number,
    options?: ServiceOptions,
  ) {
    const session = options?.session;
    const _buyerId = this.asObjectId(buyerId);
    const _orderId = this.asObjectId(orderId);
    const dec = Math.abs(Number(amount) || 0);

    const step1 = await this.coopBuyerModel.updateOne(
      { _id: _buyerId, 'buy.orderId': _orderId },
      { $unset: { 'buy.$': 1 }, $inc: { totalSum: -dec } },
      { session },
    );
    if (step1.modifiedCount === 0) return { removed: false };

    const step2 = await this.coopBuyerModel.updateOne(
      { _id: _buyerId },
      { $pull: { buy: null } },
      { session },
    );

    return { removed: (step2.modifiedCount ?? 0) > 0, step1: step1.modifiedCount, step2: step2.modifiedCount };
  }

  /**
   * Удалить одну запись credit по сумме и дате (точность: exact/minute/hour/day),
   * увеличив totalSum на эту сумму (откат оплаты).
   */
  async removeOneCreditByCriteriaAndIncTotal(
    buyerId: string | Types.ObjectId,
    criteria: { sum: number; date: Date | string; matchBy?: 'exact' | 'minute' | 'hour' | 'day' },
    options?: ServiceOptions,
  ) {
    const session = options?.session;
    const sumNum = Number(criteria.sum);
    if (!Number.isFinite(sumNum) || sumNum <= 0) return { removed: false };

    const _buyerId = this.asObjectId(buyerId);
    const baseDate = typeof criteria.date === 'string' ? new Date(criteria.date) : criteria.date;
    if (Number.isNaN(baseDate.getTime())) throw new Error('Invalid date');

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

    const elemMatch = { sum: sumNum, date: dateCond };

    const step1 = await this.coopBuyerModel.updateOne(
      { _id: _buyerId, credit: { $elemMatch: elemMatch } },
      { $unset: { 'credit.$': 1 }, $inc: { totalSum: sumNum } },
      { session },
    );
    if (step1.modifiedCount === 0) return { removed: false };

    const step2 = await this.coopBuyerModel.updateOne(
      { _id: _buyerId },
      { $pull: { credit: null } },
      { session },
    );

    return { removed: (step2.modifiedCount ?? 0) > 0, step1: step1.modifiedCount, step2: step2.modifiedCount };
  }

  /**
   * Массово убрать ссылки на debetKredit у всех покупателей.
   */
  async removeDebetKreditFromBuyers(
    debetKreditIds: string[],
    options?: ServiceOptions,
  ) {
    const session = options?.session;
    const asObjectIds = debetKreditIds.map((id) => new Types.ObjectId(id));
    const idsForIn = [...asObjectIds, ...debetKreditIds];

    return this.coopBuyerModel.updateMany(
      { debetKredit: { $in: idsForIn } },
      { $pull: { debetKredit: { $in: idsForIn } } },
      { session },
    );
  }

  // ───────────────────────── transactional delete of credit
  /**
   * Транзакционный сценарий удаления оплаты:
   * пытаемся удалить credit по minute→hour→day.
   */
  async deleteCreditTx(buyerId: string, amount: number, date: Date) {
    const session = await this.connection.startSession();
    try {
      let removed = false;
      await session.withTransaction(async () => {
        let r = await this.removeOneCreditByCriteriaAndIncTotal(buyerId, { sum: amount, date, matchBy: 'minute' }, { session });
        if (!r.removed) r = await this.removeOneCreditByCriteriaAndIncTotal(buyerId, { sum: amount, date, matchBy: 'hour' }, { session });
        if (!r.removed) r = await this.removeOneCreditByCriteriaAndIncTotal(buyerId, { sum: amount, date, matchBy: 'day' }, { session });
        removed = r.removed;
      });
      return { removed };
    } finally {
      await session.endSession();
    }
  }
}
