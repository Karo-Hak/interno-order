import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  Connection,
  Model,
  PipelineStage,
  Types,
  ClientSession,
} from 'mongoose';

import { CreatePlintRetailOrderDto } from './dto/create-plint-retail-order.dto';
import { UpdatePlintRetailOrderDto } from './dto/update-plint-retail-order.dto';

import { PlintBuyer } from 'src/plintBuyer/schema/plint-buyer.schema';
import { PlintRetailOrder } from './schema/plint-retail-order.schema';
import { PlintDebetKredit } from 'src/plint-debet-kredit/schema/plint-debet-kredit.schema';
import {
  PlintProduct,
  PlintProductDocument,
} from 'src/plint-product/schema/plint-product.schema';

// ----------------- Утилиты -----------------
const toNum = (v: any, d = 0) => {
  const n = Number.parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : d;
};

@Injectable()
export class PlintRetailOrderService {
  constructor(
    @InjectModel(PlintRetailOrder.name)
    private readonly orderModel: Model<PlintRetailOrder>,

    @InjectModel(PlintBuyer.name)
    private readonly buyerModel: Model<PlintBuyer>,

    @InjectModel(PlintDebetKredit.name)
    private readonly dkModel: Model<PlintDebetKredit>,

    // ВАЖНО: это именно модель, где лежит stockBalance (PlintProduct)
    @InjectModel(PlintProduct.name)
    private readonly productModel: Model<PlintProductDocument>,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  // ---------- DK: лог событий (покупка/платёж) ----------
  private async logDK(params: {
    type: 'Գնում' | 'Վճարում';
    amount: number;
    buyerId: Types.ObjectId;
    userId?: Types.ObjectId;
    orderId?: Types.ObjectId;
    date?: Date;
  }): Promise<Types.ObjectId> {
    const { type, amount, buyerId, userId, orderId, date } = params;
    const doc = await this.dkModel.create({
      type,
      amount,
      buyer: buyerId,
      user: userId ?? undefined,
      order: orderId ?? null,
      date: date ?? new Date(),
    });
    return (doc as any)._id as Types.ObjectId;
  }

  // ---------- Пересчёт сумм по позициям ----------
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
  //                 С К Л А Д  (id ИЛИ name)
  // =========================================================

  // достаём product ObjectId из разных возможных полей
  private getItemProductId(anyItem: any): string | null {
    const cand = [
      anyItem?.plint,
      anyItem?.product,
      anyItem?.productId,
      anyItem?.plintId,
    ];
    for (const c of cand) {
      const s = String(c ?? '').trim();
      if (Types.ObjectId.isValid(s)) return s;
      if (c && typeof c === 'object' && Types.ObjectId.isValid(String(c.$oid ?? ''))) {
        return String(c.$oid);
      }
    }
    return null;
  }

  private getItemProductName(anyItem: any): string | null {
    const name = String(anyItem?.name ?? '').trim();
    return name || null;
  }

  private toQty(v: any): number {
    const n = Number.parseFloat(String(v ?? ''));
    return Number.isFinite(n) ? n : 0;
  }

  /**
   * Строим две карты количества:
   * - по ID (если есть);
   * - по name (если id нет).
   */
  private buildQtyMaps(items: Array<any>) {
    const byId = new Map<string, number>();
    const byName = new Map<string, number>();

    for (const it of items ?? []) {
      const qty = this.toQty(it?.qty);
      if (!qty) continue;

      const pid = this.getItemProductId(it);
      if (pid) {
        byId.set(pid, (byId.get(pid) || 0) + qty);
        continue;
      }

      const name = this.getItemProductName(it);
      if (name) {
        byName.set(name, (byName.get(name) || 0) + qty);
      } else {
        // не нашли ни id, ни name — просто пропустим позицию
        // можно логировать при отладке
        // console.warn('[stock] item has no id and no name', it);
      }
    }

    return { byId, byName };
  }

  /**
   * Применяем дельты к складу.
   * sign = -1 → списать; sign = +1 → вернуть.
   * forbidNegative=true — запретить уход в минус (кинуть 400).
   */
  private async applyStockFlexible(
    items: Array<any>,
    sign: -1 | 1,
    where: string,
    session?: ClientSession,
    forbidNegative = true,
  ) {
    const { byId, byName } = this.buildQtyMaps(items);

    // сначала id
    for (const [pid, qty] of byId.entries()) {
      const inc = sign * qty;
      const filter: any =
        inc < 0 && forbidNegative
          ? { _id: pid, stockBalance: { $gte: Math.abs(inc) } }
          : { _id: pid };

      const res = await this.productModel.updateOne(
        filter,
        { $inc: { stockBalance: inc } },
        { session },
      );
      // Лог для отладки
      // eslint-disable-next-line no-console
      console.log(
        `[stock:id] ${where}: _id=${pid} inc=${inc} matched=${res.matchedCount} modified=${res.modifiedCount}`,
      );

      if (inc < 0 && forbidNegative && res.matchedCount === 0) {
        throw new BadRequestException(
          `Not enough stock for product ${pid} (need ${Math.abs(inc)})`,
        );
      }
    }

    // затем name (если id не было)
    for (const [name, qty] of byName.entries()) {
      const inc = sign * qty;
      const filter: any =
        inc < 0 && forbidNegative
          ? { name, stockBalance: { $gte: Math.abs(inc) } }
          : { name };

      const res = await this.productModel.updateOne(
        filter,
        { $inc: { stockBalance: inc } },
        { session },
      );
      // Лог для отладки
      console.log(
        `[stock:name] ${where}: name="${name}" inc=${inc} matched=${res.matchedCount} modified=${res.modifiedCount}`,
      );

      if (inc < 0 && forbidNegative && res.matchedCount === 0) {
        throw new BadRequestException(
          `Not enough stock for product "${name}" (need ${Math.abs(inc)})`,
        );
      }
    }
  }

  // разница карт (для UPDATE), возвращаем дельты по id и по name
  private diffQtyMaps(
    oldItems: any[],
    newItems: any[],
  ): { idDelta: Map<string, number>; nameDelta: Map<string, number> } {
    const { byId: oldId, byName: oldName } = this.buildQtyMaps(oldItems);
    const { byId: newId, byName: newName } = this.buildQtyMaps(newItems);

    const idDelta = new Map<string, number>();
    const nameDelta = new Map<string, number>();

    const idKeys = new Set([...oldId.keys(), ...newId.keys()]);
    for (const k of idKeys) {
      const d = (newId.get(k) || 0) - (oldId.get(k) || 0);
      if (d) idDelta.set(k, d);
    }

    const nameKeys = new Set([...oldName.keys(), ...newName.keys()]);
    for (const k of nameKeys) {
      const d = (newName.get(k) || 0) - (oldName.get(k) || 0);
      if (d) nameDelta.set(k, d);
    }

    // упакуем обратно в «позиции», чтобы переиспользовать applyStockFlexible
    const idDeltaItems = Array.from(idDelta.entries()).map(([id, qty]) => ({
      product: id,
      qty,
    }));
    const nameDeltaItems = Array.from(nameDelta.entries()).map(
      ([name, qty]) => ({ name, qty }),
    );

    // отрицательное списываем, положительное возвращаем (в applyStockFlexible мы зададим sign)
    const merged: any[] = [
      ...idDeltaItems,
      ...nameDeltaItems,
    ];

    const idMap = new Map<string, number>();
    const nameMap = new Map<string, number>();
    for (const it of merged) {
      if (it.product) idMap.set(it.product, (idMap.get(it.product) || 0) + it.qty);
      if (it.name) nameMap.set(it.name, (nameMap.get(it.name) || 0) + it.qty);
    }

    return { idDelta: idMap, nameDelta: nameMap };
  }

  // =========================================================
  //                       CREATE
  // =========================================================
  /** СОЗДАТЬ розничный заказ + списать склад */
  async create(dto: CreatePlintRetailOrderDto, userId?: string) {
    if (!dto.buyer || !Types.ObjectId.isValid(dto.buyer)) {
      throw new BadRequestException('buyer must be a valid ObjectId');
    }
    const buyerId = new Types.ObjectId(dto.buyer);

    const buyer = await this.buyerModel.findById(buyerId).lean();
    if (!buyer) throw new NotFoundException('Buyer not found');

    const date = dto.date ? new Date(dto.date) : new Date();
    const deliverySum = toNum(dto.deliverySum, 0);

    const { items, totalSum } = this.recalcTotals(dto.items || [], deliverySum);
    const balance = totalSum;

    const session = await this.connection.startSession();
    try {
      let createdId: Types.ObjectId | null = null;

      await session.withTransaction(async () => {
        // 1) Склад: списываем (sign = -1) по id и/или по name
        await this.applyStockFlexible(items as any, -1, 'retail.create', session, true);

        // 2) Создаём заказ
        const created = await this.orderModel.create(
          [
            {
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
              user:
                userId && Types.ObjectId.isValid(userId)
                  ? new Types.ObjectId(userId)
                  : undefined,
              buyer: buyerId,
            },
          ],
          { session },
        );
        createdId = (created[0] as any)._id as Types.ObjectId;

        // 3) Покупатель: привязки и увеличение долга
        await this.buyerModel.findByIdAndUpdate(
          buyerId,
          {
            $addToSet: { retailOrder: createdId },
            $push: {
              buyRetail: {
                date,
                amount: totalSum,
                orderId: createdId,
              },
            },
            $inc: { balanceAMD: totalSum },
          },
          { session },
        );

        // 4) DK: запись о покупке
        const dkPurchaseId = await this.logDK({
          type: 'Գնում',
          amount: totalSum,
          buyerId,
          userId:
            userId && Types.ObjectId.isValid(userId)
              ? new Types.ObjectId(userId)
              : undefined,
          orderId: createdId,
          date,
        });

        await this.buyerModel.findByIdAndUpdate(
          buyerId,
          { $addToSet: { debetKredit: dkPurchaseId } },
          { session },
        );
      });

      return await this.orderModel.findById(createdId).lean();
    } finally {
      session.endSession();
    }
  }

  // =========================================================
  //                       UPDATE
  // =========================================================
  async update(id: string, dto: UpdatePlintRetailOrderDto) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order id');

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        const order = await this.orderModel
          .findById(id)
          .session(session)
          .lean();
        if (!order) throw new NotFoundException('Retail order not found');
        if (order.status !== 'active') {
          throw new BadRequestException('Only active orders can be updated');
        }

        const buyerId = new Types.ObjectId(String((order as any).buyer));

        // Пересчёт сумм
        const deliverySum =
          dto.deliverySum != null
            ? toNum(dto.deliverySum, 0)
            : toNum(order.deliverySum, 0);
        const newItems = dto.items
          ? this.recalcTotals(dto.items, 0).items
          : (order.items || []);
        const { totalSum } = this.recalcTotals(newItems, deliverySum);

        const prevTotal = toNum(order.totalSum, 0);
        const deltaTotal = +(totalSum - prevTotal).toFixed(2);
        const newBalance = Math.max(toNum(order.balance, 0) + deltaTotal, 0);

        // 1) Склад: применяем дельту (new - old)
        // построим "фиктивные" массивы из разницы, затем одним вызовом списываем/возвращаем
        const { idDelta, nameDelta } = this.diffQtyMaps(order.items as any[], newItems as any[]);

        // упакуем обратно в items вид, чтобы использовать applyStockFlexible
        const deltaItems: any[] = [
          ...Array.from(idDelta.entries()).map(([product, qty]) => ({ product, qty })),
          ...Array.from(nameDelta.entries()).map(([name, qty]) => ({ name, qty })),
        ];

        // положительная дельта = надо ДОБАВИТЬ в заказ → списать со склада → sign = -1
        // отрицательная дельта = убрали из заказа → вернуть на склад → sign = +1
        // поэтому, вызываем два раза: (>=0) и (<0) отдельными списками — чтобы работал forbidNegative
        const pos = deltaItems.filter((x) => this.toQty(x.qty) > 0).map((x) => ({ ...x, qty: Math.abs(x.qty) }));
        const neg = deltaItems.filter((x) => this.toQty(x.qty) < 0).map((x) => ({ ...x, qty: Math.abs(x.qty) }));

        if (pos.length) await this.applyStockFlexible(pos, -1, 'retail.update(+)', session, true);
        if (neg.length) await this.applyStockFlexible(neg, +1, 'retail.update(-)', session, false);

        // 2) Патчим заказ
        const patch: any = {
          items: newItems,
          totalSum,
          balance: newBalance,
          deliverySum,
        };
        if (dto.date) patch.date = new Date(dto.date);
        if (dto.buyerComment !== undefined) patch.buyerComment = dto.buyerComment;
        if (dto.paymentMethod !== undefined)
          patch.paymentMethod = dto.paymentMethod;
        if (dto.delivery !== undefined) patch.delivery = !!dto.delivery;
        if (dto.deliveryAddress !== undefined)
          patch.deliveryAddress = dto.deliveryAddress;
        if (dto.deliveryPhone !== undefined)
          patch.deliveryPhone = dto.deliveryPhone;

        await this.orderModel.findByIdAndUpdate(id, patch, { session });

        // 3) Покупатель: общий долг + обновление строки в buyRetail
        const buyerOps: any = {
          $inc: { balanceAMD: deltaTotal },
          $set: {
            'buyRetail.$[b].amount': totalSum,
            'buyRetail.$[b].date': patch.date ?? order.date ?? new Date(),
          },
        };
        const arrayFilters = [{ 'b.orderId': new Types.ObjectId(id) }];

        await this.buyerModel.updateOne(
          { _id: buyerId },
          buyerOps,
          { arrayFilters, session },
        );
      });

      return { ok: true };
    } finally {
      session.endSession();
    }
  }

  // =========================================================
  //                     ADD PAYMENT
  // =========================================================
  async addPayment(id: string, amount: number, date?: string, userId?: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order id');

    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Retail order not found');
    if (order.status !== 'active') {
      throw new BadRequestException('Only active orders can be paid');
    }

    const pay = toNum(amount, 0);
    if (pay <= 0) throw new BadRequestException('Payment must be > 0');

    // 1) уменьшаем баланс заказа
    order.balance = Math.max(toNum(order.balance, 0) - pay, 0);
    await order.save();

    // 2) обновляем покупателя
    const buyerId = (order as any).buyer as Types.ObjectId;
    await this.buyerModel.findByIdAndUpdate(buyerId, {
      $push: {
        credit: {
          date: date ? new Date(date) : new Date(),
          amount: pay,
          note: `Payment for order ${order._id}`,
        },
      },
      $inc: { balanceAMD: -pay },
    });

    const userObjId =
      userId && Types.ObjectId.isValid(userId)
        ? new Types.ObjectId(userId)
        : undefined;

    // 3) DK: платёж
    const dkPaymentId = await this.logDK({
      type: 'Վճարում',
      amount: pay,
      buyerId,
      userId: userObjId,
      orderId: order._id,
      date: date ? new Date(date) : new Date(),
    });

    // 4) привязка DK
    await this.buyerModel.findByIdAndUpdate(buyerId, {
      $addToSet: { debetKredit: dkPaymentId },
    });

    return { ok: true, newBalance: order.balance };
  }

  // =========================================================
  //                       CANCEL
  // =========================================================
  async cancel(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order id');

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        const order = await this.orderModel.findById(id).session(session);
        if (!order) throw new NotFoundException('Retail order not found');
        if (order.status !== 'active') {
          throw new BadRequestException('Only active orders can be canceled');
        }

        const buyerId = (order as any).buyer as Types.ObjectId;
        const outstanding = toNum(order.balance, 0);

        // 1) вернуть на склад всё (sign = +1)
        await this.applyStockFlexible(order.items as any, +1, 'retail.cancel', session, false);

        // 2) помечаем заказ отменённым
        order.status = 'canceled';
        order.balance = 0;
        await order.save({ session });

        // 3) покупатель
        await this.buyerModel.updateOne(
          { _id: buyerId },
          {
            $pull: { buyRetail: { orderId: order._id } },
            $inc: { balanceAMD: -outstanding },
          },
          { session },
        );
      });

      return { ok: true };
    } finally {
      session.endSession();
    }
  }

  // =========================================================
  //                       DELETE (HARD)
  // =========================================================
  async delete(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order id');

    const session = await this.connection.startSession();
    try {
      let deltaBalance = 0;

      await session.withTransaction(async () => {
        const order = await this.orderModel.findById(id).session(session);
        if (!order) throw new NotFoundException('Retail order not found');

        const buyerId = order.buyer as unknown as Types.ObjectId;
        if (!buyerId || !Types.ObjectId.isValid(String(buyerId))) {
          throw new BadRequestException('Order has invalid buyer ref');
        }

        const total = Number.isFinite(Number(order.totalSum))
          ? Number(order.totalSum)
          : 0;
        deltaBalance = -total;

        // если активен — вернуть товар
        if (order.status === 'active') {
          await this.applyStockFlexible(order.items as any, +1, 'retail.delete', session, false);
        }

        // DK-покупка
        const dkPurchase = await this.dkModel
          .findOne({ order: order._id, type: 'Գնում' })
          .select({ _id: 1 })
          .lean<{ _id: Types.ObjectId } | null>({ session } as any);

        // покупатель
        await this.buyerModel.updateOne(
          { _id: buyerId },
          {
            $pull: {
              buyRetail: { orderId: order._id },
              retailOrder: order._id,
              ...(dkPurchase?._id ? { debetKredit: dkPurchase._id } : {}),
            },
            $inc: { balanceAMD: -total },
          },
          { session },
        );

        if (dkPurchase?._id) {
          await this.dkModel.deleteOne({ _id: dkPurchase._id }).session(session);
        }

        await order.deleteOne({ session });
      });

      return { ok: true, deletedId: id, balanceDelta: deltaBalance };
    } finally {
      session.endSession();
    }
  }

  // =========================================================
  //                       READ ONLY
  // =========================================================
  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid order id');
    const doc = await this.orderModel
      .findById(id)
      .populate('buyer')
      .populate('user')
      .lean();
    if (!doc) throw new NotFoundException('Retail order not found');
    return doc;
  }

  async listByBuyer(buyerId: string, limit = 100) {
    if (!Types.ObjectId.isValid(buyerId))
      throw new BadRequestException('Invalid buyer id');
    return this.orderModel
      .find({ buyer: buyerId })
      .sort({ date: -1, _id: -1 })
      .limit(limit)
      .lean();
  }

  async monthlyReport(month?: string) {
    const { from, to } = this.resolveMonthRange(month);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          date: { $gte: from, $lt: to },
          status: { $ne: 'canceled' },
        },
      },
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
    const total = rows.reduce(
      (a: number, r: any) => a + Number(r?.sum || 0),
      0,
    );
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
}
