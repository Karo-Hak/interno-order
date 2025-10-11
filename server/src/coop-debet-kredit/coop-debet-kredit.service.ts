import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { ClientSession, Connection, Model, Types } from "mongoose";
import { CoopDebetKredit } from "./schema/coop-debet-kredit.schema";
import { CoopStretchBuyer } from "src/coop-stretch-buyer/schema/coop-stretch-buyer.schema";
import { CoopCeilingOrder } from "src/coop-ceiling-order/schema/coop-ceiling-order.schema";


@Injectable()
export class CoopDebetKreditService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(CoopDebetKredit.name) private coopDebetKreditModel: Model<CoopDebetKredit>,
    @InjectModel(CoopStretchBuyer.name) private coopStretchBuyerModel: Model<CoopStretchBuyer>,
    @InjectModel(CoopCeilingOrder.name) private coopCeilingOrderModel: Model<CoopCeilingOrder>,
  ) { }

  async create(order: string, user: string, buyer: string, balance: number,) {

    const orderBuyerDocument = await this.coopStretchBuyerModel.findById(buyer);
    if (!orderBuyerDocument) {
      throw new Error('Order buyer not found');
    }

    if (balance > 0) {
      const createdDebet = await this.coopDebetKreditModel.create({
        type: "Գնում",
        user,
        buyer,
        order,
        amount: balance
      })
      orderBuyerDocument.debetKredit.push(createdDebet.id);
      await createdDebet.save()
    }

    await Promise.all([
      orderBuyerDocument.save(),
    ]);
  }

  async createPayment(
    orderId: Types.ObjectId,
    sum: number,
    opts?: { date?: Date; session?: ClientSession },
  ) {
    if (!sum || !isFinite(sum) || sum <= 0) {
      throw new BadRequestException('Payment sum must be a positive number');
    }

    const ownSession = !opts?.session;
    const session = opts?.session ?? await this.connection.startSession();

    try {
      if (ownSession) await session.startTransaction();

      const order = await this.coopCeilingOrderModel.findById(orderId).session(session);
      if (!order) throw new NotFoundException('Order not found');

      const buyer = await this.coopStretchBuyerModel.findById(order.buyer).session(session);
      if (!buyer) throw new NotFoundException('Buyer not found');

      const date = opts?.date ?? new Date();

      // DK "Վճարում" (обязательно с order)
      const createdKredit = await this.coopDebetKreditModel.create([{
        type: 'Վճարում',
        user: order.user,
        buyer: order.buyer,
        order: order._id,
        amount: sum,
        date,
      }], { session }).then(r => r[0]);

      // 🔧 кредит-лента: payment
      buyer.credit.push({ date, sum, type: 'payment', dkId: createdKredit._id, returnId: null });
      // 🔧 общий долг может уходить в минус
      buyer.totalSum = Number(buyer.totalSum || 0) - Math.abs(sum);

      // связка с DK (как было)
      buyer.debetKredit.push(createdKredit._id);

      await buyer.save({ session });

      if (ownSession) await session.commitTransaction();
      return createdKredit;
    } catch (e) {
      if (ownSession) await session.abortTransaction();
      throw e;
    } finally {
      if (ownSession) await session.endSession();
    }
  }

  async removePaymentByDkId(dkId: string) {
    const session = await this.connection.startSession();
    try {
      let deleted = false;
      await session.withTransaction(async () => {
        const dk = await this.coopDebetKreditModel.findById(dkId).session(session);
        if (!dk) throw new NotFoundException('Payment DK not found');

        const buyer = await this.coopStretchBuyerModel.findById(dk.buyer).session(session);
        if (!buyer) throw new NotFoundException('Buyer not found');

        // убрать одну запись credit по dkId (если найдётся)
        const idx = buyer.credit.findIndex((c: any) => String(c?.dkId) === String(dk._id));
        if (idx >= 0) buyer.credit.splice(idx, 1);

        // вернуть сумму в totalSum
        buyer.totalSum = Number(buyer.totalSum || 0) + Math.abs(Number(dk.amount || 0));

        // убрать ссылку из buyer.debetKredit
        buyer.debetKredit = buyer.debetKredit.filter((id: any) => String(id) !== String(dk._id));

        await buyer.save({ session });
        await this.coopDebetKreditModel.deleteOne({ _id: dk._id }).session(session);

        deleted = true;
      });
      return { deleted };
    } finally {
      await session.endSession();
    }
  }

  // fallback для старых записей без dkId
  async removePaymentByDateSum(payload: { buyerId: string; date: string; sum: number }) {
    const session = await this.connection.startSession();
    try {
      let deleted = false;
      await session.withTransaction(async () => {
        const { buyerId, date, sum } = payload;

        const buyer = await this.coopStretchBuyerModel.findById(buyerId).session(session);
        if (!buyer) throw new NotFoundException('Buyer not found');

        const targetDate = new Date(date);

        // найти одну запись credit по совпадающей сумме и близкой дате (±1 день)
        const idx = buyer.credit.findIndex((c: any) =>
          Number(c?.sum) === Number(sum) &&
          Math.abs(new Date(c?.date).getTime() - targetDate.getTime()) <= 24 * 60 * 60 * 1000
        );
        if (idx < 0) throw new NotFoundException('Matching credit entry not found');

        const removed = buyer.credit.splice(idx, 1)[0] as any;

        // если есть dkId — удаляем DK и ссылку
        if (removed?.dkId) {
          await this.coopDebetKreditModel.deleteOne({ _id: removed.dkId }).session(session);
          buyer.debetKredit = buyer.debetKredit.filter((id: any) => String(id) !== String(removed.dkId));
        } else {
          // попытаться найти DK по buyer+amount+дата ±1 день
          const dk = await this.coopDebetKreditModel.findOne({
            buyer: buyer._id,
            amount: Math.abs(Number(sum)),
            type: 'Վճարում',
            date: {
              $gte: new Date(targetDate.getTime() - 24 * 60 * 60 * 1000),
              $lte: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000),
            },
          }).session(session);
          if (dk) {
            await this.coopDebetKreditModel.deleteOne({ _id: dk._id }).session(session);
            buyer.debetKredit = buyer.debetKredit.filter((id: any) => String(id) !== String(dk._id));
          }
        }

        // вернуть сумму в totalSum
        buyer.totalSum = Number(buyer.totalSum || 0) + Math.abs(Number(sum || 0));
        await buyer.save({ session });

        deleted = true;
      });

      return { deleted };
    } finally {
      await session.endSession();
    }
  }

}