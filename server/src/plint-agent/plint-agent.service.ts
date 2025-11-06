import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { PlintAgent, PlintAgentDocument } from './schema/plint-agent.schema';
import { UpdatePlintAgentDto } from './dto/update-plint-agent.dto';
import { CreatePlintAgentDto } from './dto/create-plint-agent.dto';


const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;
const escapeRegex = (input = '') => String(input).replace(ESCAPE_REGEX, '\\$&');
const normalizePhone = (s?: string) => (s ? String(s).replace(/\D+/g, '') : '');
const toNum = (v: any, def = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};

@Injectable()
export class PlintAgentService {
  constructor(
    @InjectModel(PlintAgent.name) private readonly model: Model<PlintAgentDocument>,
  ) {}

  async create(dto: CreatePlintAgentDto) {
    const phone1Norm = normalizePhone(dto.phone1);
    const phone2Norm = normalizePhone(dto.phone2);

    if (phone1Norm || phone2Norm) {
      const or: any[] = [];
      if (phone1Norm) or.push({ phone1Norm }, { phone2Norm: phone1Norm });
      if (phone2Norm) or.push({ phone1Norm: phone2Norm }, { phone2Norm });
      const exists = await this.model.findOne({ $or: or }).lean();
      if (exists) throw new ConflictException('Agent with this phone already exists');
    }

    return this.model.create({
      ...dto,
      phone1Norm: phone1Norm || undefined,
      phone2Norm: phone2Norm || undefined,
      balanceAMD: 0,
    });
  }

  async findAll(q: {
    q?: string; skip?: number; limit?: number;
    debtOnly?: string; minBalance?: string; maxBalance?: string;
  }) {
    const { q: textRaw, skip = 0, limit = 200, debtOnly, minBalance, maxBalance } = q || {};
    const filter: FilterQuery<PlintAgentDocument> = {};

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
      if (norm) or.push({ phone1Norm: norm }, { phone2Norm: norm });
      filter.$or = or;
    }

    if (debtOnly === 'true') filter.balanceAMD = { $gt: 0 };
    if (minBalance !== undefined) {
      const v = Number(minBalance);
      if (!Number.isNaN(v)) filter.balanceAMD = { ...(filter.balanceAMD || {}), $gte: v };
    }
    if (maxBalance !== undefined) {
      const v = Number(maxBalance);
      if (!Number.isNaN(v)) filter.balanceAMD = { ...(filter.balanceAMD || {}), $lte: v };
    }

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .select({
          name: 1, phone1: 1, phone2: 1, region: 1, address: 1, balanceAMD: 1,
          // при необходимости можно выдавать counts массивов:
          // creditCount: { $size: "$credit" }, buyCount: { $size: "$buy" }
        })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.model.countDocuments(filter),
    ]);

    return { items, total, skip, limit };
  }

  async findOne(id: string) {
    const doc = await this.model
      .findById(id)
      .populate('wholesaleOrder')
      .populate('debetKredit')
      .lean();
    if (!doc) throw new NotFoundException('Plint Agent not found');
    return doc;
  }

  async update(id: string, dto: UpdatePlintAgentDto) {
    const patch: any = { ...dto };

    if (dto.phone1 !== undefined) patch.phone1Norm = normalizePhone(dto.phone1) || undefined;
    if (dto.phone2 !== undefined) patch.phone2Norm = normalizePhone(dto.phone2) || undefined;

    if (patch.phone1Norm || patch.phone2Norm) {
      const or: any[] = [];
      if (patch.phone1Norm) or.push({ phone1Norm: patch.phone1Norm }, { phone2Norm: patch.phone1Norm });
      if (patch.phone2Norm) or.push({ phone1Norm: patch.phone2Norm }, { phone2Norm: patch.phone2Norm });
      const exists = await this.model.findOne({ _id: { $ne: id }, $or: or }).lean();
      if (exists) throw new ConflictException('Agent with this phone already exists');
    }

    const updated = await this.model.findByIdAndUpdate(id, patch, { new: true, lean: true });
    if (!updated) throw new NotFoundException('Plint Agent not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Plint Agent not found');
    return { ok: true, id };
  }

  // ====== Баланс (как у тебя) ======
  async adjustBalance(id: string, deltaAMD: number) {
    if (typeof deltaAMD !== 'number' || Number.isNaN(deltaAMD)) {
      throw new BadRequestException('deltaAMD must be a number');
    }
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $inc: { balanceAMD: deltaAMD } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint Agent not found');
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
    if (!doc) throw new NotFoundException('Plint Agent not found');
    return doc;
  }

  /** Привязать заказ */
  async linkOrder(id: string, orderId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $addToSet: { plintOrder: orderId } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint Agent not found');
    return doc;
  }

  /** Привязать дебет/кредит */
  async linkDebetKredit(id: string, dkId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $addToSet: { debetKredit: dkId } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint Agent not found');
    return doc;
  }

  /** Отвязать (на всякий случай) */
  async unlinkOrder(id: string, orderId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $pull: { wholesaleOrder: orderId } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint Agent not found');
    return doc;
  }

  async unlinkDebetKredit(id: string, dkId: string) {
    const doc = await this.model.findByIdAndUpdate(
      id,
      { $pull: { debetKredit: dkId } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint Agent not found');
    return doc;
  }

  // ====== НОВОЕ: работа с credit[] ======
  async addCredit(agentId: string, payload: { date: string | Date; amount: number; note?: string; createdBy?: string }) {
    const item: any = {
      date: new Date(payload.date),
      amount: toNum(payload.amount, 0),
    };
    if (payload.note) item.note = String(payload.note).trim();
    if (payload.createdBy) item.createdBy = new Types.ObjectId(payload.createdBy);

    const doc = await this.model.findByIdAndUpdate(
      agentId,
      { $push: { credit: item }, $inc: { balanceAMD: -item.amount } }, // кредит уменьшает долг
      { new: true, lean: true, runValidators: true },
    );
    if (!doc) throw new NotFoundException('Plint agent not found');
    return doc;
  }

  async removeCredit(agentId: string, creditItemId: string) {
    // найдём удаляемый элемент, чтобы корректно откатить баланс
    const agent = await this.model.findById(agentId).select({ credit: 1 }).lean();
    if (!agent) throw new NotFoundException('Plint agent not found');

    const item = (agent.credit || []).find((x: any) => String(x._id) === String(creditItemId));
    if (!item) throw new NotFoundException('Credit item not found');

    const doc = await this.model.findByIdAndUpdate(
      agentId,
      { $pull: { credit: { _id: new Types.ObjectId(creditItemId) } }, $inc: { balanceAMD: +item.amount } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint agent not found after pull');
    return doc;
  }

  // ====== НОВОЕ: работа с buy[] ======
  async addBuy(agentId: string, payload: { date: string | Date; amount: number; orderId: string }) {
    const item = {
      date: new Date(payload.date),
      amount: toNum(payload.amount, 0),
      orderId: new Types.ObjectId(payload.orderId),
    };

    const doc = await this.model.findByIdAndUpdate(
      agentId,
      { $push: { buy: item }, $inc: { balanceAMD: +item.amount } }, // покупка увеличивает долг
      { new: true, lean: true, runValidators: true },
    );
    if (!doc) throw new NotFoundException('Plint agent not found');
    return doc;
  }

  async removeBuy(agentId: string, buyItemId: string) {
    const agent = await this.model.findById(agentId).select({ buy: 1 }).lean();
    if (!agent) throw new NotFoundException('Plint agent not found');

    const item = (agent.buy || []).find((x: any) => String(x._id) === String(buyItemId));
    if (!item) throw new NotFoundException('Buy item not found');

    const doc = await this.model.findByIdAndUpdate(
      agentId,
      { $pull: { buy: { _id: new Types.ObjectId(buyItemId) } }, $inc: { balanceAMD: -item.amount } },
      { new: true, lean: true },
    );
    if (!doc) throw new NotFoundException('Plint agent not found after pull');
    return doc;
  }

  // ====== Дополнительно: посчитать баланс из массивов без опоры на balanceAMD ======
  async getComputedBalanceFromArrays(agentId: string) {
    const [row] = await this.model.aggregate([
      { $match: { _id: new Types.ObjectId(agentId) } },
      {
        $project: {
          totalBuy: { $sum: '$buy.amount' },
          totalCredit: { $sum: '$credit.amount' },
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
