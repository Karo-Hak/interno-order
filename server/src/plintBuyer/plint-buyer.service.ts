import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types, Connection } from 'mongoose';
import { PlintBuyer, PlintBuyerDocument } from './schema/plint-buyer.schema';
// Если есть отдельные DTO — оставляем твои:
import { CreatePlintBuyerDto } from './dto/create-plint-buyer.dto';
import { UpdatePlintBuyerDto } from './dto/update-plint-buyer.dto';
import { PlintDebetKredit } from 'src/plint-debet-kredit/schema/plint-debet-kredit.schema';

// === ВАЖНО ===
// Предполагается, что у тебя есть отдельная схема/модель DebetKredit для записей DK.
// Если она находится в другом модуле — импортируй её тип/имя модели отсюда:
type DebetKreditDoc = any; // подставь реальный тип
const DEBET_KREDIT_MODEL_NAME = 'DebetKredit'; // подставь реальное имя модели, если другое

const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;
const escapeRegex = (input = '') => String(input).replace(ESCAPE_REGEX, '\\$&');
const normalizePhone = (s?: string) => (s ? String(s).replace(/\D+/g, '') : '');
const toNum = (v: any, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

@Injectable()
export class PlintBuyerService {
  constructor(
    @InjectModel(PlintBuyer.name) private readonly model: Model<PlintBuyerDocument>,
     @InjectModel(PlintDebetKredit.name) private readonly dKmodel: Model<PlintDebetKredit>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  // ----------------- CREATE -----------------
  async create(dto: CreatePlintBuyerDto) {
    const phone1Norm = normalizePhone(dto.phone1);
    const phone2Norm = normalizePhone(dto.phone2);

    if (phone1Norm || phone2Norm) {
      const or: any[] = [];
      if (phone1Norm) or.push({ phone1Norm }, { phone2Norm: phone1Norm });
      if (phone2Norm) or.push({ phone1Norm: phone2Norm }, { phone2Norm });
      const exists = await this.model.findOne({ $or: or }).lean();
      if (exists) throw new ConflictException('Buyer with this phone already exists');
    }

    return this.model.create({
      ...dto,
      phone1Norm: phone1Norm || undefined,
      phone2Norm: phone2Norm || undefined,
      balanceAMD: 0,
    });
  }

  // ----------------- FIND ALL -----------------
  async findAll(q: {
    q?: string;
    skip?: number;
    limit?: number;
    debtOnly?: string;
    minBalance?: string;
    maxBalance?: string;
  }) {
    const {
      q: textRaw,
      skip = 0,
      limit = 200,
      debtOnly,
      minBalance,
      maxBalance,
    } = q || {};

    const filter: FilterQuery<PlintBuyerDocument> = {};
    const text = (textRaw ?? '').trim().slice(0, 100);

    if (text) {
      const safe = escapeRegex(text);
      const rx = new RegExp(safe, 'i');
      const norm = normalizePhone(text);
      const or: any[] = [
        { name: rx },
        { region: rx },
        { address: rx },
        { phone1: rx },
        { phone2: rx },
      ];
      if (norm) {
        or.push({ phone1Norm: norm }, { phone2Norm: norm });
      }
      (filter as any).$or = or;
    }

    if (debtOnly === 'true') {
      (filter as any).balanceAMD = { $gt: 0 };
    }
    if (minBalance !== undefined) {
      const v = Number(minBalance);
      if (!Number.isNaN(v)) {
        (filter as any).balanceAMD = {
          ...(filter as any).balanceAMD,
          $gte: v,
        };
      }
    }
    if (maxBalance !== undefined) {
      const v = Number(maxBalance);
      if (!Number.isNaN(v)) {
        (filter as any).balanceAMD = {
          ...(filter as any).balanceAMD,
          $lte: v,
        };
      }
    }

    const pipeline: any[] = [
      { $match: filter },
      { $sort: { name: 1 } },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
      {
        $project: {
          // базовая инфа
          name: 1,
          phone1: 1,
          phone2: 1,
          region: 1,
          address: 1,
          balanceAMD: 1,

          // массивы ссылок
          retailOrder: 1,
          wholesaleOrder: 1,
          debetKredit: 1,

          // массивы движений
          credit: 1,
          buyRetail: 1,
          buyWholesale: 1,

          // подсчёты
          retailOrderCount: { $size: { $ifNull: ['$retailOrder', []] } },
          wholesaleOrderCount: { $size: { $ifNull: ['$wholesaleOrder', []] } },
          dkCount: { $size: { $ifNull: ['$debetKredit', []] } },

          creditCount: { $size: { $ifNull: ['$credit', []] } },
          creditSum: {
            $sum: {
              $map: {
                input: { $ifNull: ['$credit', []] },
                as: 'c',
                in: { $toDouble: { $ifNull: ['$$c.amount', 0] } },
              },
            },
          },

          buyRetailCount: { $size: { $ifNull: ['$buyRetail', []] } },
          buyWholesaleCount: { $size: { $ifNull: ['$buyWholesale', []] } },
          buyRetailSum: {
            $sum: {
              $map: {
                input: { $ifNull: ['$buyRetail', []] },
                as: 'br',
                in: { $toDouble: { $ifNull: ['$$br.amount', 0] } },
              },
            },
          },
          buyWholesaleSum: {
            $sum: {
              $map: {
                input: { $ifNull: ['$buyWholesale', []] },
                as: 'bw',
                in: { $toDouble: { $ifNull: ['$$bw.amount', 0] } },
              },
            },
          },
        },
      },
      {
        $addFields: {
          ordersCount: { $add: ['$retailOrderCount', '$wholesaleOrderCount'] },
          buyCount: { $add: ['$buyRetailCount', '$buyWholesaleCount'] },
          buySum: { $add: ['$buyRetailSum', '$buyWholesaleSum'] },

          // для фронта
          total: '$balanceAMD',
        },
      },
    ];

    const [items, total] = await Promise.all([
      this.model.aggregate(pipeline),
      this.model.countDocuments(filter),
    ]);

    return { items, total, skip, limit };
  }

  // ----------------- FIND ONE -----------------
  async findOne(id: string) {
    const doc = await this.model
      .findById(id)
      .populate({ path: 'wholesaleOrder', options: { sort: { date: -1 } } })
      .populate({ path: 'retailOrder', options: { sort: { date: -1 } } })
      .populate({ path: 'debetKredit', options: { sort: { date: -1 } } })
      .lean();

    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  // ----------------- UPDATE/DELETE BUYER -----------------
  async update(id: string, dto: UpdatePlintBuyerDto) {
    const patch: any = { ...dto };

    if (dto.phone1 !== undefined)
      patch.phone1Norm = normalizePhone(dto.phone1) || undefined;
    if (dto.phone2 !== undefined)
      patch.phone2Norm = normalizePhone(dto.phone2) || undefined;

    if (patch.phone1Norm || patch.phone2Norm) {
      const or: any[] = [];
      if (patch.phone1Norm)
        or.push({ phone1Norm: patch.phone1Norm }, { phone2Norm: patch.phone1Norm });
      if (patch.phone2Norm)
        or.push({ phone1Norm: patch.phone2Norm }, { phone2Norm: patch.phone2Norm });

      const exists = await this.model.findOne({ _id: { $ne: id }, $or: or }).lean();
      if (exists) throw new ConflictException('Buyer with this phone already exists');
    }

    const updated = await this.model.findByIdAndUpdate(id, patch, { new: true, lean: true });
    if (!updated) throw new NotFoundException('Plint buyer not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Plint buyer not found');
    return { ok: true, id };
  }

  // ----------------- БАЛАНС -----------------
  async adjustBalance(id: string, deltaAMD: number) {
    if (typeof deltaAMD !== 'number' || Number.isNaN(deltaAMD)) {
      throw new BadRequestException('deltaAMD must be a number');
    }
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $inc: { balanceAMD: deltaAMD } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  async setBalance(id: string, valueAMD: number) {
    if (typeof valueAMD !== 'number' || Number.isNaN(valueAMD)) {
      throw new BadRequestException('valueAMD must be a number');
    }
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $set: { balanceAMD: valueAMD } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  // ----------------- ЛИНКИ ЗАКАЗОВ/DK -----------------
  async linkRetailOrder(id: string, orderId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $addToSet: { retailOrder: new Types.ObjectId(orderId) } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  async linkWholesaleOrder(id: string, orderId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $addToSet: { wholesaleOrder: new Types.ObjectId(orderId) } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  async unlinkRetailOrder(id: string, orderId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $pull: { retailOrder: new Types.ObjectId(orderId) } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  async unlinkWholesaleOrder(id: string, orderId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $pull: { wholesaleOrder: new Types.ObjectId(orderId) } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  async linkDebetKredit(id: string, dkId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $addToSet: { debetKredit: new Types.ObjectId(dkId) } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  async unlinkDebetKredit(id: string, dkId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $pull: { debetKredit: new Types.ObjectId(dkId) } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  // ----------------- CREDIT[] -----------------
  async addCredit(buyerId: string, payload: { date: string | Date; amount: number; note?: string; createdBy?: string; dkId?: string }) {
    const item: any = {
      date: new Date(payload.date),
      amount: toNum(payload.amount, 0),
    };
    if (payload.note) item.note = String(payload.note).trim();
    if (payload.createdBy) item.createdBy = new Types.ObjectId(payload.createdBy);
    if (payload.dkId) item.dkId = new Types.ObjectId(payload.dkId);

    const doc = await this.model.findByIdAndUpdate(
      buyerId,
      { $push: { credit: item }, $inc: { balanceAMD: -item.amount } }, // кредит уменьшает долг
      { new: true, lean: true, runValidators: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  /** Удалить платёж по (дата ±1день + сумма), найти и удалить связанный DK */
  async removePaymentByDateSum(payload: { buyerId: string; date: string | Date; sum: number }) {
    const session = await this.connection.startSession();
    try {
      let deleted = false;
      await session.withTransaction(async () => {
        const { buyerId, date, sum } = payload;

        const buyer = await this.model.findById(buyerId).session(session);
        if (!buyer) throw new NotFoundException('Buyer not found');

        const targetDate = new Date(date);
        const idx = (buyer.credit || []).findIndex((c: any) =>
          Number(c?.amount) === Number(sum) &&
          Math.abs(new Date(c?.date).getTime() - targetDate.getTime()) <= 24 * 60 * 60 * 1000
        );
        if (idx < 0) throw new NotFoundException('Matching credit entry not found');

        const removed = (buyer.credit as any[]).splice(idx, 1)[0];

        // удаляем связанный DK если был
        if (removed?.dkId) {
          await this.dKmodel.deleteOne({ _id: removed.dkId }).session(session);
          buyer.debetKredit = (buyer.debetKredit || []).filter((id: any) => String(id) !== String(removed.dkId));
        } else {
          // поиск DK по эвристике
          const dk = await this.dKmodel.findOne({
            buyer: buyer._id,
            amount: Math.abs(Number(sum)),
            type: 'Վճարում',
            date: {
              $gte: new Date(targetDate.getTime() - 24 * 60 * 60 * 1000),
              $lte: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
            },
          }).session(session);
          if (dk) {
            await this.dKmodel.deleteOne({ _id: dk._id }).session(session);
            buyer.debetKredit = (buyer.debetKredit || []).filter((id: any) => String(id) !== String(dk._id));
          }
        }

        // вернуть сумму в баланс (удалили платёж — долг вырос)
        buyer.balanceAMD = Number(buyer.balanceAMD || 0) + Math.abs(Number(sum || 0));
        await buyer.save({ session });

        deleted = true;
      });

      return { deleted };
    } finally {
      await session.endSession();
    }
  }

  // ----------------- BUY[] -----------------
  /** Добавить розничную покупку (увеличивает долг) */
  async addRetailBuy(buyerId: string, payload: { date: string | Date; amount: number; orderId: string }) {
    const item = {
      date: new Date(payload.date),
      amount: toNum(payload.amount, 0),
      orderId: new Types.ObjectId(payload.orderId),
    };
    const doc = await this.model.findByIdAndUpdate(
      buyerId,
      { $push: { buyRetail: item }, $inc: { balanceAMD: +item.amount } },
      { new: true, lean: true, runValidators: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  /** Добавить оптовую покупку (увеличивает долг) */
  async addWholesaleBuy(buyerId: string, payload: { date: string | Date; amount: number; orderId: string }) {
    const item = {
      date: new Date(payload.date),
      amount: toNum(payload.amount, 0),
      orderId: new Types.ObjectId(payload.orderId),
    };
    const doc = await this.model.findByIdAndUpdate(
      buyerId,
      { $push: { buyWholesale: item }, $inc: { balanceAMD: +item.amount } },
      { new: true, lean: true, runValidators: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found');
    return doc;
  }

  /** Удалить из розничных покупок */
  async removeRetailBuy(buyerId: string, buyItemId: string) {
    // узнаём сумму
    const buyer = await this.model.findById(buyerId).select({ buyRetail: 1 }).lean();
    if (!buyer) throw new NotFoundException('Plint buyer not found');
    const item = (buyer.buyRetail || []).find((x: any) => String(x._id) === String(buyItemId));
    if (!item) throw new NotFoundException('Retail buy item not found');

    const doc = await this.model.findByIdAndUpdate(
      buyerId,
      { $pull: { buyRetail: { _id: new Types.ObjectId(buyItemId) } }, $inc: { balanceAMD: -Number(item.amount || 0) } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found after pull');
    return doc;
  }

  /** Удалить из оптовых покупок */
  async removeWholesaleBuy(buyerId: string, buyItemId: string) {
    const buyer = await this.model.findById(buyerId).select({ buyWholesale: 1 }).lean();
    if (!buyer) throw new NotFoundException('Plint buyer not found');
    const item = (buyer.buyWholesale || []).find((x: any) => String(x._id) === String(buyItemId));
    if (!item) throw new NotFoundException('Wholesale buy item not found');

    const doc = await this.model.findByIdAndUpdate(
      buyerId,
      { $pull: { buyWholesale: { _id: new Types.ObjectId(buyItemId) } }, $inc: { balanceAMD: -Number(item.amount || 0) } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint buyer not found after pull');
    return doc;
  }

  // ----------------- ВЫЧИСЛИТЬ БАЛАНС ИЗ МАССИВОВ -----------------
  async getComputedBalanceFromArrays(buyerId: string) {
    const [row] = await this.model.aggregate([
      { $match: { _id: new Types.ObjectId(buyerId) } },
      {
        $project: {
          totalBuyRetail: { $sum: { $map: { input: { $ifNull: ['$buyRetail', []] }, as: 'x', in: { $toDouble: { $ifNull: ['$$x.amount', 0] } } } } },
          totalBuyWholesale: { $sum: { $map: { input: { $ifNull: ['$buyWholesale', []] }, as: 'x', in: { $toDouble: { $ifNull: ['$$x.amount', 0] } } } } },
          totalCredit: { $sum: { $map: { input: { $ifNull: ['$credit', []] }, as: 'x', in: { $toDouble: { $ifNull: ['$$x.amount', 0] } } } } },
        },
      },
      {
        $project: {
          totalBuy: { $add: ['$totalBuyRetail', '$totalBuyWholesale'] },
          totalCredit: 1,
        },
      },
      {
        $project: {
          totalBuy: 1,
          totalCredit: 1,
          balance: { $subtract: ['$totalBuy', '$totalCredit'] },
        },
      },
    ]);

    const totalBuy = row?.totalBuy || 0;
    const totalCredit = row?.totalCredit || 0;
    return { totalBuy, totalCredit, balance: totalBuy - totalCredit };
  }
}
