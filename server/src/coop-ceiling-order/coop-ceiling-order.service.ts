import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';

import { CoopCeilingOrder } from './schema/coop-ceiling-order.schema';
import { CoopStretchBuyer } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { CoopStretchBuyerService } from 'src/coop-stretch-buyer/coop-stretch-buyer.service';
import { CreateCoopOrderDto, StretchTextureOrderDto } from './dto/create-coop-ceiling-order.dto';
import { UpdateCoopOrderDto } from './dto/update-coop-ceiling-order.dto';
import { CoopDebetKredit } from 'src/coop-debet-kredit/schema/coop-debet-kredit.schema';

type IdLike = string | Types.ObjectId;
const toId = (v: IdLike) => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v));
const num = (v: any, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const r2 = (v: number) => Math.round(v * 100) / 100;

type MonthlyRow = {
  _id: string;
  date: Date;
  buyerName?: string;
  buyerPhone?: string;
  sum: number;
};

function monthRangeUTC(month?: string): { start: Date; end: Date } {
  const now = new Date();
  const [y, m] = month?.split('-') ?? [
    String(now.getUTCFullYear()),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
  ];
  const year = Number(y);
  const monthIdx = Number(m) - 1;
  const start = new Date(Date.UTC(year, monthIdx, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, monthIdx + 1, 1, 0, 0, 0, 0));
  return { start, end };
}

function currentMonthTag(tz: string) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(now);
  const y = parts.find(p => p.type === 'year')?.value ?? String(now.getUTCFullYear());
  const m = parts.find(p => p.type === 'month')?.value ?? String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

@Injectable()
export class CoopCeilingOrderService {
  constructor(
    @InjectModel(CoopCeilingOrder.name)
    private readonly orderModel: Model<CoopCeilingOrder>,
    @InjectModel(CoopStretchBuyer.name)
    private readonly buyerModel: Model<CoopStretchBuyer>,
    @InjectConnection()
    private readonly connection: Connection,
    @InjectModel(CoopDebetKredit.name)
    private readonly dkModel: Model<CoopDebetKredit>,

    private readonly coopBuyerService: CoopStretchBuyerService,
  ) { }

  // ───────────── helper: найти/создать покупателя
  private async resolveBuyer(
    buyer: { buyerId?: string; phone1?: string; name?: string; phone2?: string; region?: string; address?: string },
    session?: ClientSession,
  ): Promise<string> {
    if (buyer.buyerId) return buyer.buyerId;

    if (buyer.phone1) {
      const found = await this.coopBuyerService.findByPhone(buyer.phone1, session);
      if (found) return (found as any)._id.toString();
    }
    const created = await this.coopBuyerService.create(
      {
        name: buyer.name ?? 'Без названия',
        phone1: buyer.phone1 ?? '',
        phone2: buyer.phone2 ?? '',
        region: buyer.region ?? '',
        address: buyer.address ?? '',
      },
      session,
    );
    return (created as any)._id.toString();
  }

  // ───────────── нормализация групп
  /** TEXTURE: храним height/width/sq/price/sum, пересчитываем sq/sum при необходимости */
  private mapTextureRows(arr: any[] = []) {
    return (arr ?? []).map((row) => {
      const height = num(row?.height, 0);
      const width = num(row?.width, 0);
      const qty = r2(num(row?.qty, height * width)); // 👈 qty = пришло | height*width
      const price = num(row?.price, 0);
      const sum = r2(num(row?.sum, qty * price));
      return {
        name: String(row?.name ?? ''),
        height,
        width,
        qty,      // ← храним qty
        price,
        sum,
      };
    });
  }

  /** SIMPLE (profil/platform/ring): { name, qty, price, sum }, сумма досчитывается при необходимости */
  private mapSimpleRows(arr: any[] = []) {
    return (arr ?? []).map((row) => {
      const qty = num(row?.qty, 0);
      const price = num(row?.price, 0);
      const sum = r2(num(row?.sum, qty * price));
      return {
        name: String(row?.name ?? ''),
        qty,
        price,
        sum,
      };
    });
  }

  // ───────────── собрать патч заказа из DTO (create)
  private buildPatch(o: StretchTextureOrderDto, buyerId: IdLike, userId: IdLike) {
    return {
      groupedStretchTextureData: this.mapTextureRows(o.groupedStretchTextureData),
      groupedStretchProfilData: this.mapSimpleRows(o.groupedStretchProfilData),
      groupedLightPlatformData: this.mapSimpleRows(o.groupedLightPlatformData),
      groupedLightRingData: this.mapSimpleRows(o.groupedLightRingData),

      date: o.date ? new Date(o.date) : new Date(),
      buyerComment: o.buyerComment ?? '',
      balance: num(o.balance, 0),
      paymentMethod: (o.paymentMethod as any) ?? 'cash',
      picUrl: Array.isArray(o.picUrl) ? o.picUrl : [],

      buyer: toId(buyerId),
      user: toId(userId),
    };
  }

  // ───────────── create with transaction
  async createWithBuyerResolution(dto: CreateCoopOrderDto) {
    const session = await this.connection.startSession();
    try {
      let created: any;
      await session.withTransaction(async () => {
        const buyerId = await this.resolveBuyer(dto.buyer, session);
        const patch = this.buildPatch(dto.stretchTextureOrder ?? {}, buyerId, dto.userId);

        created = await this.orderModel.create([patch], { session }).then((r) => r[0]);

        // привязка заказа к покупателю
        await this.buyerModel.updateOne(
          { _id: toId(buyerId) },
          { $addToSet: { order: created._id } },
          { session },
        );

        // баланс заказа
        const bal = Number(patch.balance || 0);

        // 1) учёт у покупателя (как и было)
        if (bal > 0) {
          await this.coopBuyerService.upsertBuyMergeSum(
            buyerId,
            { date: patch.date, sum: bal, orderId: created._id },
            { session },
          );
        }

        // 2) ✅ записываем Debet/Kredit (и ссылку в покупателя)
        if (bal > 0) {
          const dk = await this.dkModel.create(
            [{
              date: patch.date,
              type: 'Գնում',                            // наименование операции
              amount: bal,
              user: toId(dto.userId),
              buyer: toId(buyerId),
              order: created._id,
            }],
            { session }
          ).then(r => r[0]);

          await this.buyerModel.updateOne(
            { _id: toId(buyerId) },
            { $addToSet: { debetKredit: dk._id } },
            { session }
          );
        }
      });

      return created;
    } finally {
      await session.endSession();
    }
  }


  async findAll() {
    return this.orderModel.find().sort({ date: -1 }).lean().exec();
  }
  async findAllWallet() {
    return await this.orderModel.find().lean().exec();
  }

  async filterOrder(startDate: Date, endDate: Date) {
    return this.orderModel
      .find({ date: { $gte: startDate, $lte: endDate } })
      .populate('buyer')
      .sort({ date: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string) {
    const doc = await this.orderModel
      .findById(id)
      .populate('buyer')
      .lean()
      .exec();
    if (!doc) throw new NotFoundException('Order not found');
    return doc;
  }

  // ───────────── update (перенос заказа между покупателями + синхронизация buy)
  async update(id: string, dto: UpdateCoopOrderDto) {
    const current: any = await this.orderModel.findById(id).exec();
    if (!current) throw new NotFoundException('Order not found');

    const session = await this.connection.startSession();
    try {
      let updated: any;
      await session.withTransaction(async () => {
        // возможно — смена покупателя
        let nextBuyerId: string | undefined;
        if (dto.buyerId) nextBuyerId = dto.buyerId;

        // собираем патч
        const patch: any = {};

        // если пришли массивы — нормализуем так же, как при create
        if (dto.groupedStretchTextureData) patch.groupedStretchTextureData = this.mapTextureRows(dto.groupedStretchTextureData as any[]);
        if (dto.groupedStretchProfilData) patch.groupedStretchProfilData = this.mapSimpleRows(dto.groupedStretchProfilData as any[]);
        if (dto.groupedLightPlatformData) patch.groupedLightPlatformData = this.mapSimpleRows(dto.groupedLightPlatformData as any[]);
        if (dto.groupedLightRingData) patch.groupedLightRingData = this.mapSimpleRows(dto.groupedLightRingData as any[]);

        if (dto.picUrl) patch.picUrl = dto.picUrl;
        if (dto.buyerComment != null) patch.buyerComment = dto.buyerComment;
        if (dto.paymentMethod != null) patch.paymentMethod = dto.paymentMethod as any;
        if (dto.date != null) patch.date = new Date(dto.date as any);
        const balanceProvided = dto.balance != null;
        if (balanceProvided) patch.balance = num(dto.balance, 0);
        if (nextBuyerId) patch.buyer = toId(nextBuyerId);
        if (dto.userId) patch.user = toId(dto.userId);

        updated = await this.orderModel.findByIdAndUpdate(id, patch, { new: true, session }).exec();
        if (!updated) throw new NotFoundException('Order not found after update');

        // баланс изменился → синхронизируем запись buy у текущего покупателя
        if (balanceProvided) {
          await this.coopBuyerService.upsertBuyMergeSum(
            (updated.buyer as Types.ObjectId).toString(),
            { date: updated.date, sum: num(updated.balance, 0), orderId: updated._id.toString() },
            { session },
          );
        }

        // перенос между покупателями
        const oldBuyerId = (current.buyer as Types.ObjectId).toString();
        const newBuyerId = (updated.buyer as Types.ObjectId).toString();
        if (oldBuyerId !== newBuyerId) {
          // убрать ссылку у старого
          await this.buyerModel.updateOne(
            { _id: toId(oldBuyerId) },
            { $pull: { order: updated._id } },
            { session },
          );
          // добавить ссылку новому
          await this.buyerModel.updateOne(
            { _id: toId(newBuyerId) },
            { $addToSet: { order: updated._id } },
            { session },
          );

          // удалить buy у старого (на сумму старого баланса)
          const oldBalance = num(current.balance, 0);
          if (oldBalance > 0) {
            await this.coopBuyerService.removeOneBuyByOrderIdAndDecTotal(
              oldBuyerId,
              updated._id.toString(),
              oldBalance,
              { session },
            );
          }

          // поставить buy у нового покупателя (на новую сумму баланса)
          await this.coopBuyerService.upsertBuyMergeSum(
            newBuyerId,
            { date: updated.date, sum: num(updated.balance, 0), orderId: updated._id.toString() },
            { session },
          );
        }
      });

      return updated;
    } finally {
      await session.endSession();
    }
  }

  // ───────────── remove (с чисткой ссылок и buy)
  async remove(id: string) {
    const session = await this.connection.startSession();
    try {
      let message = '';
      await session.withTransaction(async () => {
        const order: any = await this.orderModel.findById(id).session(session);
        if (!order) {
          message = `Order ${id} not found`;
          return;
        }
        const buyerId = (order.buyer as Types.ObjectId).toString();
        const balance = num(order.balance, 0);

        // удалить заказ
        await this.orderModel.deleteOne({ _id: toId(id) }).session(session);

        // убрать ссылку у покупателя
        await this.coopBuyerService.deleteFromOrderArray(buyerId, id, { session });

        // удалить ровно одну запись buy по этому orderId + скорректировать totalSum
        if (balance > 0) {
          await this.coopBuyerService.removeOneBuyByOrderIdAndDecTotal(buyerId, id, balance, { session });
        }

        message = `Removed coop ceiling order #${id}`;
      });

      return { message };
    } finally {
      await session.endSession();
    }
  }

  /**
   * Отчёт за месяц (таймзона учитывается через $dateToString).
   */
  async getMonthlyReport(month?: string, tz = 'Asia/Yerevan') {
    const monthTag = month ?? currentMonthTag(tz);

    const [facet] = await this.orderModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              { $dateToString: { format: '%Y-%m', date: '$date', timezone: tz } },
              monthTag,
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'coopstretchbuyers',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      { $unwind: { path: '$buyer', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          _sumTexture: { $ifNull: [{ $sum: '$groupedStretchTextureData.sum' }, 0] },
          _sumProfil: { $ifNull: [{ $sum: '$groupedStretchProfilData.sum' }, 0] },
          _sumPlat: { $ifNull: [{ $sum: '$groupedLightPlatformData.sum' }, 0] },
          _sumRing: { $ifNull: [{ $sum: '$groupedLightRingData.sum' }, 0] },
        },
      },
      { $addFields: { computedSum: { $add: ['$_sumTexture', '$_sumProfil', '$_sumPlat', '$_sumRing'] } } },
      {
        $facet: {
          rows: [
            {
              $project: {
                _id: { $toString: '$_id' },
                date: 1,
                name: '$buyer.name',
                phone1: '$buyer.phone1',
                buyerName: '$buyer.name',
                buyerPhone: '$buyer.phone1',
                sum: { $ifNull: ['$balance', '$computedSum'] },
              },
            },
            { $sort: { date: 1 } },
          ],
          totals: [
            { $project: { sum: { $ifNull: ['$balance', '$computedSum'] } } },
            { $group: { _id: null, total: { $sum: '$sum' }, count: { $sum: 1 } } },
          ],
        },
      },
    ]).exec();

    const total = facet?.totals?.[0]?.total ?? 0;
    const count = facet?.totals?.[0]?.count ?? 0;

    return { rows: facet?.rows ?? [], total, count, month: monthTag, tz };
  }

  /**
   * Детальный заказ с популяцией покупателя.
   */
  async findOneDetailed(id: string) {
    const doc = await this.orderModel
      .findById(id)
      .populate({ path: 'buyer', select: 'name phone1 phone2 region address' })
      .lean()
      .exec();

    if (!doc) throw new NotFoundException('Order not found');

    const buyer: any = doc.buyer || null;

    return {
      _id: String(doc._id),
      date: doc.date,
      paymentMethod: doc.paymentMethod ?? null,
      buyerComment: doc.buyerComment ?? null,
      balance: Number(doc.balance ?? 0),

      buyer: buyer
        ? {
          _id: buyer._id ? String(buyer._id) : undefined,
          name: buyer.name ?? '',
          phone1: buyer.phone1 ?? '',
          phone2: buyer.phone2 ?? '',
          region: buyer.region ?? '',
          address: buyer.address ?? '',
        }
        : null,

      groupedStretchTextureData: Array.isArray(doc.groupedStretchTextureData)
        ? doc.groupedStretchTextureData
        : [],
      groupedStretchProfilData: Array.isArray(doc.groupedStretchProfilData)
        ? doc.groupedStretchProfilData
        : [],
      groupedLightPlatformData: Array.isArray(doc.groupedLightPlatformData)
        ? doc.groupedLightPlatformData
        : [],
      groupedLightRingData: Array.isArray(doc.groupedLightRingData)
        ? doc.groupedLightRingData
        : [],
    };
  }

  /**
   * Полное удаление заказа в транзакции.
   */
  async removeTx(id: string): Promise<{ removed: boolean }> {
    const session = await this.connection.startSession();
    try {
      let removed = false;

      await session.withTransaction(async () => {
        const order = await this.orderModel.findById(id).session(session);
        if (!order) throw new NotFoundException('Order not found');

        const buyerId = (order.buyer as any)?.toString?.() ?? String(order.buyer);
        const orderId = new Types.ObjectId(id);
        const balance = num(order.balance, 0);

        // 1) удалить заказ
        await this.orderModel.deleteOne({ _id: orderId }).session(session);

        // 2) убрать ссылку заказа у покупателя
        await this.buyerModel.updateOne(
          { _id: buyerId },
          { $pull: { order: orderId } },
          { session },
        );

        // 3) удалить 1 запись buy по orderId и откатить totalSum на сумму баланса
        const step1 = await this.buyerModel.updateOne(
          {
            _id: buyerId,
            buy: { $elemMatch: { orderId: { $in: [orderId, String(orderId)] } } },
          },
          { $unset: { 'buy.$': 1 }, $inc: { totalSum: -Math.abs(balance) } },
          { session },
        );

        if (step1.modifiedCount > 0) {
          await this.buyerModel.updateOne(
            { _id: buyerId },
            { $pull: { buy: null } },
            { session },
          );
        }

        // 4) ✅ удалить связанные проводки CoopDebetKredit и их ссылки у покупателя
        const dkDocs = await this.dkModel
          .find({ order: orderId, buyer: buyerId })
          .session(session)
          .select('_id')
          .lean();

        if (dkDocs.length > 0) {
          const dkIds = dkDocs.map(d => d._id);

          // удалить проводки
          await this.dkModel.deleteMany({ _id: { $in: dkIds } }).session(session);

          // убрать их ссылки у покупателя
          await this.buyerModel.updateOne(
            { _id: buyerId },
            { $pull: { debetKredit: { $in: dkIds } } },
            { session },
          );
        }

        removed = true;
      });

      return { removed };
    } finally {
      await session.endSession();
    }
  }

}
