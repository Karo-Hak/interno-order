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

  private toObjId(v: any): Types.ObjectId {
    if (v instanceof Types.ObjectId) return v;
    const s = String(v ?? "").trim();
    if (!s) throw new BadRequestException("Invalid ObjectId");
    return new Types.ObjectId(s);
  }

  async create(order: string, user: string, buyer: string, balance: number) {
    const orderBuyerDocument = await this.coopStretchBuyerModel.findById(buyer);
    if (!orderBuyerDocument) {
      throw new Error("Order buyer not found");
    }

    if (balance > 0) {
      const createdDebet = await this.coopDebetKreditModel.create({
        type: "Գնում",
        user,
        buyer,
        order,
        amount: balance,
      });

      // лучше _id чем id
      orderBuyerDocument.debetKredit.push(createdDebet._id as any);
      await orderBuyerDocument.save();
    }
  }

  async createPayment(
    orderId: Types.ObjectId | string | undefined | null,
    buyerId: Types.ObjectId | string | undefined | null,
    sum: number,
    opts?: { date?: Date; session?: ClientSession; userId?: Types.ObjectId | string },
  ) {
    const amount = Number(sum);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException("Payment sum must be a positive number");
    }
    if (!buyerId) {
      throw new BadRequestException("buyerId is required");
    }

    const ownSession = !opts?.session;
    const session = opts?.session ?? (await this.connection.startSession());

    try {
      if (ownSession) await session.startTransaction();

      const date = opts?.date ?? new Date();
      const buyerObjId = this.toObjId(buyerId);

      const buyer = await this.coopStretchBuyerModel.findById(buyerObjId).session(session);
      if (!buyer) throw new NotFoundException("Buyer not found");

      let order: any = null;

      if (orderId) {
        const orderObjId = this.toObjId(orderId);
        order = await this.coopCeilingOrderModel.findById(orderObjId).session(session);
        if (!order) throw new NotFoundException("Order not found");

        if (String(order.buyer) !== String(buyer._id)) {
          throw new BadRequestException("Order does not belong to buyer");
        }
      }

      const userId = order?.user ?? opts?.userId;
      if (!userId) throw new BadRequestException("Unauthorized: userId is required");

      const createdKredit = await this.coopDebetKreditModel
        .create([{
          type: "Վճարում",
          user: userId,
          buyer: buyer._id,
          order: order?._id ?? null,
          amount,
          date,
        }], { session })
        .then(r => r[0]);


      buyer.credit.push({
        date,
        sum: amount,
        type: "payment",
        dkId: createdKredit._id,
        returnId: null,
      } as any);

      buyer.totalSum = Number(buyer.totalSum || 0) - Math.abs(amount);
      buyer.debetKredit.push(createdKredit._id as any);

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


  async createReturnPayment(
    orderId: Types.ObjectId,
    sum: number,
    opts?: { date?: Date; session?: ClientSession },
  ) {
    if (!sum || !isFinite(sum) || sum <= 0) {
      throw new BadRequestException("Payment sum must be a positive number");
    }

    const ownSession = !opts?.session;
    const session = opts?.session ?? (await this.connection.startSession());

    try {
      if (ownSession) await session.startTransaction();

      const order = await this.coopCeilingOrderModel.findById(orderId).session(session);
      if (!order) throw new NotFoundException("Order not found");

      const buyer = await this.coopStretchBuyerModel.findById(order.buyer).session(session);
      if (!buyer) throw new NotFoundException("Buyer not found");

      const date = opts?.date ?? new Date();

      const createdKredit = await this.coopDebetKreditModel
        .create(
          [
            {
              type: "Վերադարձ",
              user: order.user,
              buyer: order.buyer,
              order: order._id,
              amount: sum,
              date,
            },
          ],
          { session },
        )
        .then((r) => r[0]);

      buyer.credit.push({
        date,
        sum,
        type: "returnPayment",
        dkId: createdKredit._id,
        returnId: null,
      } as any);

      buyer.totalSum = Number(buyer.totalSum || 0) + Math.abs(sum);
      buyer.debetKredit.push(createdKredit._id as any);

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
        if (!dk) throw new NotFoundException("Payment DK not found");

        if (dk.type !== "Վճարում" && dk.type !== "Վերադարձ") {
          throw new BadRequestException("DK is not a payment/return");
        }

        const buyer = await this.coopStretchBuyerModel.findById(dk.buyer).session(session);
        if (!buyer) throw new NotFoundException("Buyer not found");

        const idx =
          buyer.credit?.findIndex((c: any) => String(c?.dkId) === String(dk._id)) ?? -1;
        if (idx >= 0) buyer.credit.splice(idx, 1);

        const amt = Math.abs(Number(dk.amount ?? 0));
        const cur = Number(buyer.totalSum ?? 0);

        if (dk.type === "Վճարում") buyer.totalSum = cur + amt;
        else buyer.totalSum = cur - amt;

        buyer.debetKredit = (buyer.debetKredit ?? []).filter(
          (id: any) => String(id) !== String(dk._id),
        );

        await buyer.save({ session });
        await this.coopDebetKreditModel.deleteOne({ _id: dk._id }).session(session);

        deleted = true;
      });

      return { deleted };
    } finally {
      await session.endSession();
    }
  }
}
