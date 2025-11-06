import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model, Types } from "mongoose";
import { DebetKredit, DebetKreditDocument } from "./schema/debet-kredit.schema";
import { StretchBuyer, StretchBuyerDocument } from "src/stretch-buyer/schema/stretch-buyer.schema";
import { StretchCeilingOrder, StretchCeilingOrderDocument } from "src/stretch-ceiling-order/schema/stretch-ceiling-order.schema";
import { StretchBuyerService } from "src/stretch-buyer/stretch-buyer.service";

type IdLike = string | Types.ObjectId;

interface ServiceOptions {
  session?: ClientSession;
}

const toObjectId = (v: IdLike) => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v));

@Injectable()
export class DebetKreditService {
  constructor(
    @InjectModel(DebetKredit.name) private debetKreditModel: Model<DebetKreditDocument>,
    @InjectModel(StretchBuyer.name) private stretchBuyerModel: Model<StretchBuyerDocument>,
    @InjectModel(StretchCeilingOrder.name) private stretchCeilingOrderModel: Model<StretchCeilingOrderDocument>,

    private readonly stretchBuyerService: StretchBuyerService,

  ) { }

  /**
   * Создаёт записи "Գնում" (debet) и/или "Վճարում" (kredit) для заказа.
   * Поддерживает транзакционную сессию через options.session.
   * Возвращает созданные документы (если суммы > 0).
   */
  async create(
    order: IdLike,
    user: IdLike,
    buyer: IdLike,
    balance: number,
    prepayment: number,
    options?: ServiceOptions,
  ): Promise<{ debet?: DebetKreditDocument; kredit?: DebetKreditDocument }> {
    const session = options?.session;

    const buyerId = toObjectId(buyer);
    const userId = toObjectId(user);
    const orderId = toObjectId(order);

    // Проверим, что покупатель существует
    const buyerExists = await this.stretchBuyerModel.exists({ _id: buyerId }).session(session ?? null);
    if (!buyerExists) throw new NotFoundException("Order buyer not found");

    const result: { debet?: DebetKreditDocument; kredit?: DebetKreditDocument } = {};

    // 1) ГНУМ (Պокупка) — balance
    if (balance > 0) {
      const debetDoc = new this.debetKreditModel({
        type: "Գնում",
        user: userId,
        buyer: buyerId,
        order: orderId,
        amount: balance,
      });
      await debetDoc.save({ session });

      // Привязываем к покупателю без дублей
      await this.stretchBuyerModel.updateOne(
        { _id: buyerId },
        { $addToSet: { debetKredit: debetDoc._id } },
        { session },
      );

      result.debet = debetDoc;
    }

    // 2) ՎՃԱՐՈՒՄ (Оплата) — prepayment
    if (prepayment > 0) {
      const kreditDoc = new this.debetKreditModel({
        type: "Վճարում",
        user: userId,
        buyer: buyerId,
        order: orderId,
        amount: prepayment,
      });
      await kreditDoc.save({ session });

      await this.stretchBuyerModel.updateOne(
        { _id: buyerId },
        { $addToSet: { debetKredit: kreditDoc._id } },
        { session },
      );

      result.kredit = kreditDoc;
    }

    return result;
  }

  /**
   * Добавляет оплату (Վճարում) по заказу и привязывает её к покупателю.
   */
  async createPayment(orderId: IdLike, sum: number, options?: ServiceOptions): Promise<DebetKreditDocument> {
  const session = options?.session;
  const _orderId = toObjectId(orderId);

  const order = await this.stretchCeilingOrderModel.findById(_orderId).session(session ?? null);
  if (!order) throw new NotFoundException("Order not found");

  const buyerId = toObjectId(order.buyer as IdLike);
  const userId = toObjectId(order.user as IdLike);
  const amount = Number(sum) || 0;

  // 1) создаём документ платежа
  const kreditDoc = new this.debetKreditModel({
    type: "Վճարում",
    user: userId,
    buyer: buyerId,
    order: _orderId,
    amount,
  });
  await kreditDoc.save({ session });

  // 2) обновляем кошелёк покупателя (твоя логика)
  await this.stretchBuyerService.addCreditIfNotExists(buyerId._id.toString(), {
    date: new Date(),
    sum: amount,
    orderId: _orderId.toString(),
  });

  await this.stretchBuyerModel.updateOne(
    { _id: buyerId },
    { $addToSet: { debetKredit: kreditDoc._id } },
    { session },
  );

  await this.stretchCeilingOrderModel.updateOne(
    { _id: _orderId },
    [
      {
        $set: {
          prepayment: { $add: [{ $ifNull: ["$prepayment", 0] }, amount] },

          groundTotal: {
            $max: [
              0,
              {
                $subtract: [
                  { $ifNull: ["$groundTotal", { $ifNull: ["$totalSum", 0] }] },
                  amount,
                ],
              },
            ],
          },

          updatedAt: new Date(),
        },
      },
    ],
    { session },
  );

  return kreditDoc;
}


  // Алиас для обратной совместимости с твоим именем метода
  async creatPayment(orderId: IdLike, sum: number, options?: ServiceOptions) {
    return this.createPayment(orderId, sum, options);
  }

  async findAllByBuyer() {
    return this.stretchBuyerModel
      .find()
      .populate("debetKredit").populate("order")
      .sort({ _id: -1 });
  }

  async findByOrder(orderId: IdLike, options?: ServiceOptions) {
    const session = options?.session ?? null;
    return this.debetKreditModel
      .find({ order: toObjectId(orderId) })
      .sort({ date: -1 })
      .session(session) // 👈 прокинули
      .lean()
      .exec();
  }


  async updateBalance(sum: number, id: IdLike) {
    return this.debetKreditModel.findByIdAndUpdate(
      toObjectId(id),
      { amount: sum },
      { new: true }, // вернёт обновлённый документ
    );
  }

  async updateBuyer(oldId: IdLike, newId: IdLike) {
    return this.debetKreditModel.updateMany(
      { buyer: toObjectId(oldId) },
      { $set: { buyer: toObjectId(newId) } },
    );
  }

  async findByDate(startDate: Date, endDate: Date) {
    return this.debetKreditModel
      .find({
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: -1 });
  }

  /**
   * Массовое удаление документов по id, с поддержкой session.
   */
  async deleteDocuments(ids: IdLike[], options?: ServiceOptions) {
    const session = options?.session;
    const objectIds = ids.map(toObjectId);
    const res = await this.debetKreditModel.deleteMany({ _id: { $in: objectIds } }, { session });
    return { deletedCount: res.deletedCount ?? 0 };
  }

  /**
   * Удалить РОВНО ОДНУ запись DK с type="Վճարում" по buyerId + amount + date.
   * matchBy: 'exact' | 'minute' | 'hour' | 'day' (по умолчанию 'day').
   * Также удаляет ссылку на документ из buyer.debetKredit.
   */
  async removeOnePaymentByCriteria(
    criteria: {
      buyerId: IdLike;
      amount: number;
      date: Date | string;
      matchBy?: 'exact' | 'minute' | 'hour' | 'day';
    },
    options?: ServiceOptions
  ): Promise<{ removed: boolean; dkId?: string; pulled?: boolean }> {
    const session = options?.session ?? null;

    // 1) нормализуем вход
    const buyerId = toObjectId(criteria.buyerId);
    const amountNum = Number(criteria.amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      return { removed: false };
    }
    const baseDate = typeof criteria.date === 'string' ? new Date(criteria.date) : criteria.date;
    if (Number.isNaN(baseDate.getTime())) {
      throw new Error('Invalid date for payment removal');
    }

    // 2) построим интервал даты
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

    // 3) найдём ОДИН документ с type="Վճարում"
    const filter = {
      type: 'Վճարում',
      buyer: buyerId,
      amount: amountNum,
      date: dateCond,
    };

    // берём ближайший по дате (на твой вкус: 1 — старший, -1 — младший)
    const toDelete = await this.debetKreditModel
      .findOne(filter)
      .sort({ date: 1 })
      .session(session)
      .select({ _id: 1 })
      .lean()
      .exec();

    if (!toDelete?._id) return { removed: false };

    const dkId = toDelete._id as Types.ObjectId;

    // 4) удаляем сам документ
    const delRes = await this.debetKreditModel
      .deleteOne({ _id: dkId })
      .session(session)
      .exec();

    if ((delRes.deletedCount ?? 0) === 0) {
      return { removed: false };
    }

    // 5) убираем ссылку у покупателя
    const pullRes = await this.stretchBuyerModel.updateOne(
      { _id: buyerId },
      { $pull: { debetKredit: dkId } },
      { session: session ?? undefined }
    );

    return { removed: true, dkId: dkId.toString(), pulled: pullRes.modifiedCount > 0 };
  }



}
