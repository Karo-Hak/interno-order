import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import { PlintBuyer } from 'src/plintBuyer/schema/plint-buyer.schema';
import { UpdatePlintWholesaleOrderDto } from './dto/update-plint-wholesale-order.dto';
import { CreatePlintWholesaleOrderDto } from './dto/create-plint-wholesale-order.dto';
import { PlintWholesaleOrder } from './schema/plint-wholesale-order.schema';

import { PlintAgent, PlintAgentDocument } from 'src/plint-agent/schema/plint-agent.schema';
import { PlintAgentDebetKredit } from 'src/plint-agent-debet-kredit/schema/plint-agent-debet-kredit.schema';
import { PlintDebetKredit } from 'src/plint-debet-kredit/schema/plint-debet-kredit.schema';

import { PlintProduct, PlintProductDocument } from 'src/plint-product/schema/plint-product.schema';

const toNum = (v: any, d = 0) => {
  const n = Number.parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : d;
};

@Injectable()
export class PlintWholesaleOrderService {
  constructor(
    @InjectModel(PlintWholesaleOrder.name) private readonly orderModel: Model<PlintWholesaleOrder>,
    @InjectModel(PlintBuyer.name) private readonly buyerModel: Model<PlintBuyer>,
    @InjectModel(PlintDebetKredit.name) private readonly dkModel: Model<PlintDebetKredit>,
    @InjectModel(PlintAgent.name) private readonly agentModel: Model<PlintAgentDocument>,
    @InjectModel(PlintAgentDebetKredit.name) private readonly agentDkModel: Model<PlintAgentDebetKredit>,
    @InjectModel(PlintProduct.name) private readonly productModel: Model<PlintProductDocument>,
  ) {}

  // ----------------- DK -----------------
  private async logDK(params: {
    type: 'Գնում' | 'Վճարում';
    amount: number;
    buyerId: Types.ObjectId;
    userId?: Types.ObjectId;
    agentId?: Types.ObjectId;
    orderId?: Types.ObjectId;
    date?: Date;
  }): Promise<Types.ObjectId> {
    const { type, amount, buyerId, userId, orderId, agentId, date } = params;
    const doc = await this.dkModel.create({
      type,
      amount,
      buyer: buyerId,
      user: userId ?? undefined,
      agent: agentId ?? undefined,
      order: orderId ?? null,
      date: date ?? new Date(),
    });
    return (doc as any)._id as Types.ObjectId;
  }

  private async logAgentDK(params: {
    type: 'Գնում' | 'Վճարում';
    amount: number;
    agentId: Types.ObjectId;
    buyerId?: Types.ObjectId;
    userId?: Types.ObjectId;
    orderId?: Types.ObjectId;
    date?: Date;
  }): Promise<Types.ObjectId> {
    const { type, amount, agentId, buyerId, userId, orderId, date } = params;
    const doc = await this.agentDkModel.create({
      type,
      amount,
      agent: agentId,
      buyer: buyerId ?? undefined,
      user: userId ?? undefined,
      order: orderId ?? undefined,
      date: date ?? new Date(),
    });
    return (doc as any)._id as Types.ObjectId;
  }

  // ----------------- Totals -----------------
  private recalcTotals(
    items: Array<{ qty: number; price: number; sum?: number }>,
    deliverySum = 0,
  ) {
    const fixed = (items ?? []).map((it) => {
      const qty = toNum(it.qty, 0);
      const price = toNum(it.price, 0);
      const sum = +(qty * price).toFixed(2);
      return { ...it, qty, price, sum };
    });

    const itemsSum = fixed.reduce((s, x) => s + toNum(x.sum, 0), 0);
    const totalSum = +(itemsSum + toNum(deliverySum, 0)).toFixed(2);

    return { items: fixed, itemsSum, totalSum };
  }

  // =========================================================
  //                 С К Л А Д  (по имени продукта)
  // =========================================================
  /**
   * Группируем позиции по ключу продукта.
   * Сейчас используем name, потому что он unique в PlintProduct.
   * Если решишь добавить sku в PlintProduct — замени key на it.sku и обнови индекс.
   */
  private buildQtyByProductName(items: Array<{ name?: string; qty?: number }>) {
    const map = new Map<string, number>();
    for (const it of items ?? []) {
      const name = String(it?.name ?? '').trim();
      if (!name) continue;
      const qty = Number(it?.qty) || 0;
      if (!qty) continue;
      map.set(name, (map.get(name) || 0) + qty);
    }
    return map; // Map<productName, totalQty>
  }

  /**
   * Применить дельты к складу:
   * sign = -1 → списать; sign = +1 → вернуть.
   * Обновление идёт по имени продукта (unique).
   */
  private async applyStockByName(
    items: Array<{ name?: string; qty?: number }>,
    sign: -1 | 1,
    where: string,
  ) {
    const map = this.buildQtyByProductName(items);
    if (map.size === 0) {
      console.warn(`[stock] ${where}: no items with product name`);
      return;
    }

    for (const [name, qty] of map.entries()) {
      const inc = sign * qty;
      const filter: any = inc < 0 ? { name, stockBalance: { $gte: Math.abs(inc) } } : { name };
      const res = await this.productModel.updateOne(filter, { $inc: { stockBalance: inc } });
      console.log(`[stock] ${where}: name="${name}" inc=${inc} -> matched=${res.matchedCount} modified=${res.modifiedCount}`);
      if (inc < 0 && res.matchedCount === 0) {
        // тут можно кидать 400, если нужно жёстко запрещать уход в минус:
        // throw new BadRequestException(`Not enough stock for "${name}", need ${Math.abs(inc)}`);
        console.warn(`[stock] ${where}: NOT ENOUGH or product not found for "${name}"`);
      }
    }
  }

  // =========================================================
  //                        CREATE
  // =========================================================
  async create(dto: CreatePlintWholesaleOrderDto, userId?: string) {
    if (!dto.buyer || !Types.ObjectId.isValid(dto.buyer)) {
      throw new BadRequestException('buyer must be a valid ObjectId');
    }
    const buyerId = new Types.ObjectId(dto.buyer);

    const buyer = await this.buyerModel.findById(buyerId).lean();
    if (!buyer) throw new NotFoundException('Buyer not found');

    const agentId =
      dto.agent && Types.ObjectId.isValid(dto.agent)
        ? new Types.ObjectId(dto.agent)
        : undefined;

    const date = dto.date ? new Date(dto.date) : new Date();
    const deliverySum = toNum(dto.deliverySum, 0);

    const { items, totalSum } = this.recalcTotals(dto.items || [], deliverySum);
    const balance = totalSum;

    // 1) Списываем склад по именам
    await this.applyStockByName(items as any, -1, 'wholesale.create');

    // 2) Создаём заказ
    const created = await this.orderModel.create({
      items,
      date,
      buyerComment: dto.buyerComment ?? '',
      paymentMethod: dto.paymentMethod ?? '',
      delivery: !!dto.delivery,
      deliveryAddress: dto.deliveryAddress ?? '',
      deliveryPhone: dto.deliveryPhone ?? '',
      deliverySum,
      totalSum,
      balance,
      status: 'active',
      user: userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
      buyer: buyerId,
      agent: agentId ?? null,
      agentDiscount: dto.agentDiscount ?? null,
      agentSum: dto.agentSum ?? null,
    });

    // 3) buyer: wholesaleOrder + buyWholesale + balanceAMD
    await this.buyerModel.findByIdAndUpdate(buyerId, {
      $addToSet: { wholesaleOrder: created._id },
      $push: {
        buyWholesale: { date, amount: totalSum, orderId: created._id },
      },
      $inc: { balanceAMD: totalSum },
    });

    // 4) DK (покупка)
    const dkPurchaseIdForBuyer = await this.logDK({
      type: 'Գնում',
      amount: totalSum,
      buyerId,
      userId: userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
      orderId: created._id,
      date,
    });

    await this.buyerModel.findByIdAndUpdate(buyerId, {
      $addToSet: { debetKredit: dkPurchaseIdForBuyer },
    });

    // 5) Агент (если есть)
    if (agentId) {
      const agentDebt = toNum(dto.agentSum, 0);

      await this.agentModel.findByIdAndUpdate(agentId, {
        $addToSet: { wholesaleOrder: created._id },
        $push: { buy: { date, amount: agentDebt, orderId: created._id } },
        $inc: { balanceAMD: agentDebt },
      });

      const agentDkId = await this.logAgentDK({
        type: 'Գնում',
        amount: agentDebt,
        agentId,
        buyerId,
        userId: userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
        orderId: created._id,
        date,
      });

      await this.agentModel.findByIdAndUpdate(agentId, {
        $addToSet: { debetKredit: agentDkId },
      });
    }

    return created.toObject();
  }

  // =========================================================
  //                        UPDATE
  // =========================================================
  async update(id: string, dto: UpdatePlintWholesaleOrderDto) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid order id');

    const old = await this.orderModel.findById(id).lean();
    if (!old) throw new NotFoundException('Wholesale order not found');
    if (old.status !== 'active') throw new BadRequestException('Only active orders can be updated');

    const buyerId = new Types.ObjectId(String((old as any).buyer));

    const deliverySum = dto.deliverySum != null ? toNum(dto.deliverySum, 0) : toNum(old.deliverySum, 0);
    const newItems = dto.items ? this.recalcTotals(dto.items, 0).items : (old.items || []);
    const { totalSum } = this.recalcTotals(newItems, deliverySum);

    const prevTotal = toNum(old.totalSum, 0);
    const deltaTotal = +(totalSum - prevTotal).toFixed(2);
    const newBalance = Math.max(toNum(old.balance, 0) + deltaTotal, 0);

    // 1) Возврат старых на склад
    await this.applyStockByName(old.items as any, +1, 'wholesale.update:restore-old');

    // 2) Списание новых
    await this.applyStockByName(newItems as any, -1, 'wholesale.update:take-new');

    // 3) Патчим заказ
    const patch: any = {
      items: newItems,
      totalSum,
      balance: newBalance,
      deliverySum,
    };
    if (dto.date) patch.date = new Date(dto.date);
    if (dto.buyerComment !== undefined) patch.buyerComment = dto.buyerComment;
    if (dto.paymentMethod !== undefined) patch.paymentMethod = dto.paymentMethod;
    if (dto.delivery !== undefined) patch.delivery = !!dto.delivery;
    if (dto.deliveryAddress !== undefined) patch.deliveryAddress = dto.deliveryAddress;
    if (dto.deliveryPhone !== undefined) patch.deliveryPhone = dto.deliveryPhone;

    await this.orderModel.findByIdAndUpdate(id, patch);

    // 4) buyer: balance + update buyWholesale row
    const buyerOps: any = {
      $inc: { balanceAMD: deltaTotal },
      $set: {
        'buyWholesale.$[b].amount': totalSum,
        'buyWholesale.$[b].date': patch.date ?? old.date ?? new Date(),
      },
    };
    const arrayFilters = [{ 'b.orderId': new Types.ObjectId(id) }];

    await this.buyerModel.updateOne({ _id: buyerId }, buyerOps, { arrayFilters });

    return { ok: true };
  }

  // =========================================================
  //                        PAYMENTS
  // =========================================================
  async addPayment(id: string, amount: number, date?: string, userId?: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid order id');

    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Wholesale order not found');
    if (order.status !== 'active') throw new BadRequestException('Only active orders can be paid');

    const pay = toNum(amount, 0);
    if (pay <= 0) throw new BadRequestException('Payment must be > 0');

    order.balance = Math.max(toNum(order.balance, 0) - pay, 0);
    await order.save();

    const buyerId = (order as any).buyer as Types.ObjectId;

    await this.buyerModel.findByIdAndUpdate(buyerId, {
      $push: {
        credit: {
          date: date ? new Date(date) : new Date(),
          amount: pay,
          note: `Payment for wholesale order ${order._id}`,
        },
      },
      $inc: { balanceAMD: -pay },
    });

    const userObjId =
      userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined;

    const dkPaymentId = await this.logDK({
      type: 'Վճարում',
      amount: pay,
      buyerId,
      userId: userObjId,
      orderId: order._id,
      date: date ? new Date(date) : new Date(),
    });

    await this.buyerModel.findByIdAndUpdate(buyerId, {
      $addToSet: { debetKredit: dkPaymentId },
    });

    return { ok: true, newBalance: order.balance };
  }

  async addAgentPayment(id: string, amount: number, date?: string, userId?: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid order id');

    const order = await this.orderModel.findById(id).lean();
    if (!order) throw new NotFoundException('Wholesale order not found');
    if (order.status !== 'active') throw new BadRequestException('Only active orders can be paid');

    const agentId = order.agent as unknown as Types.ObjectId | null | undefined;
    if (!agentId || !Types.ObjectId.isValid(String(agentId))) {
      throw new BadRequestException('Order has no agent');
    }

    const pay = toNum(amount, 0);
    if (pay <= 0) throw new BadRequestException('Payment must be > 0');

    const buyerId = (order as any).buyer as Types.ObjectId;
    const userObjId = userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined;

    await this.agentModel.findByIdAndUpdate(agentId, {
      $push: {
        credit: {
          date: date ? new Date(date) : new Date(),
          amount: pay,
          note: `Agent payment for wholesale order ${order._id}`,
          createdBy: userObjId,
        },
      },
      $inc: { balanceAMD: -pay },
    });

    const agentDkId = await this.logAgentDK({
      type: 'Վճարում',
      amount: pay,
      agentId: new Types.ObjectId(String(agentId)),
      buyerId: new Types.ObjectId(String(buyerId)),
      userId: userObjId,
      orderId: new Types.ObjectId(String(order._id)),
      date: date ? new Date(date) : new Date(),
    });

    const updatedAgent = await this.agentModel.findByIdAndUpdate(
      agentId,
      { $addToSet: { debetKredit: agentDkId } },
      { new: true, lean: true, select: { balanceAMD: 1 } },
    );

    return { ok: true, newAgentBalance: updatedAgent?.balanceAMD ?? undefined };
  }

  // =========================================================
  //                        CANCEL
  // =========================================================
  async cancel(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid order id');

    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Wholesale order not found');
    if (order.status !== 'active') throw new BadRequestException('Only active orders can be canceled');

    const buyerId = (order as any).buyer as Types.ObjectId;
    const outstanding = toNum(order.balance, 0);

    // 1) Вернуть на склад всё по именам
    await this.applyStockByName(order.items as any, +1, 'wholesale.cancel');

    // 2) Отметить заказ отменённым
    order.status = 'canceled';
    order.balance = 0;
    await order.save();

    // 3) Покупатель
    await this.buyerModel.updateOne(
      { _id: buyerId },
      {
        $pull: { buyWholesale: { orderId: order._id } },
        $inc: { balanceAMD: -outstanding },
      },
    );

    return { ok: true };
  }

  // =========================================================
  //                        READ
  // =========================================================
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid order id');
    const doc = await this.orderModel
      .findById(id)
      .populate('buyer')
      .populate('user')
      .lean();
    if (!doc) throw new NotFoundException('Wholesale order not found');
    return doc;
  }

  async listByBuyer(buyerId: string, limit = 100) {
    if (!Types.ObjectId.isValid(buyerId)) throw new BadRequestException('Invalid buyer id');
    return this.orderModel
      .find({ buyer: buyerId })
      .sort({ date: -1, _id: -1 })
      .limit(limit)
      .lean();
  }

  async monthlyReport(month?: string) {
    const { from, to } = this.resolveMonthRange(month);

    const pipeline: PipelineStage[] = [
      { $match: { date: { $gte: from, $lt: to }, status: { $ne: 'canceled' } } },
      {
        $lookup: {
          from: 'plint_buyers',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyerDoc',
        },
      },
      { $unwind: { path: '$buyerDoc', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          date: 1,
          sum: { $ifNull: ['$totalSum', 0] },
          buyerName: '$buyerDoc.name',
          buyerPhone: '$buyerDoc.phone1',
        },
      },
      { $sort: { date: -1, _id: -1 } },
    ];

    const rows = await this.orderModel.aggregate(pipeline);
    const total = rows.reduce((a: number, r: any) => a + Number(r?.sum || 0), 0);
    return { rows, total, count: rows.length };
  }

  private resolveMonthRange(month?: string) {
    let y: number, m: number;
    if (typeof month === 'string' && /^\d{4}-\d{2}$/.test(month)) {
      const [yy, mm] = month.split('-');
      y = Number(yy);
      m = Number(mm);
    } else {
      const now = new Date();
      y = now.getFullYear();
      m = now.getMonth() + 1;
    }
    const from = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
    const to = new Date(Date.UTC(y, m, 1, 0, 0, 0));
    return { from, to };
  }

  // =========================================================
  //                        DELETE (HARD)
  // =========================================================
  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order id');
    }

    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Wholesale order not found');
    }

    const buyerId = order.buyer as unknown as Types.ObjectId;
    if (!buyerId || !Types.ObjectId.isValid(String(buyerId))) {
      throw new BadRequestException('Order has invalid buyer ref');
    }

    const agentId = order.agent as unknown as Types.ObjectId | null | undefined;
    const hasAgent = !!agentId && Types.ObjectId.isValid(String(agentId));

    const totalBuyer = Number.isFinite(Number(order.totalSum))
      ? Number(order.totalSum)
      : 0;

    const totalAgent = Number.isFinite(Number(order.agentSum))
      ? Number(order.agentSum)
      : 0;

    // если активен — вернуть товар на склад
    if (order.status === 'active') {
      await this.applyStockByName(order.items as any, +1, 'wholesale.delete');
    }

    // DK покупателя "Գնում"
    const dkPurchase = await this.dkModel
      .findOne({ order: order._id, type: 'Գնում' })
      .select({ _id: 1 })
      .lean<{ _id: Types.ObjectId } | null>();

    await this.buyerModel.updateOne(
      { _id: buyerId },
      {
        $pull: {
          wholesaleOrder: order._id,
          buyWholesale: { orderId: order._id },
          ...(dkPurchase?._id ? { debetKredit: dkPurchase._id } : {}),
        },
        $inc: { balanceAMD: -totalBuyer },
      },
    );

    if (dkPurchase?._id) {
      await this.dkModel.deleteOne({ _id: dkPurchase._id });
    }

    if (hasAgent) {
      const agentDkPurchase = await this.agentDkModel
        .findOne({ order: order._id, type: 'Գնում' })
        .select({ _id: 1 })
        .lean<{ _id: Types.ObjectId } | null>();

      await this.agentModel.updateOne(
        { _id: agentId },
        {
          $pull: {
            wholesaleOrder: order._id,
            buy: { orderId: order._id },
            ...(agentDkPurchase?._id ? { debetKredit: agentDkPurchase._id } : {}),
          },
          $inc: { balanceAMD: -totalAgent },
        },
      );

      if (agentDkPurchase?._id) {
        await this.agentDkModel.deleteOne({ _id: agentDkPurchase._id });
      }
    }

    await order.deleteOne();

    return {
      ok: true,
      deletedId: id,
      balanceDeltaBuyer: -totalBuyer,
      ...(hasAgent
        ? { balanceDeltaAgent: -totalAgent, agentId: String(agentId) }
        : {}),
    };
  }
}
