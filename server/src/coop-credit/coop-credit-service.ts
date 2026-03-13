import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId, Types } from "mongoose";
import { CoopCredit, CoopCreditDocument } from "./schema/coop-credit.schema";

type AnyPayload = { amount?: any; date?: any; orderId?: any;[k: string]: any };

type CreatePayload = {
    userId?: string;
    coopId?: string;
    firstBuyAmount?: any;
    firstBuyDate?: any;
    firstBuyOrderId?: string;
    firstCreditAmount?: any;
    firstCreditDate?: any;
};

@Injectable()
export class CoopCreditService {
    constructor(
        @InjectModel(CoopCredit.name)
        private readonly creditModel: Model<CoopCreditDocument>
    ) { }

    private parseMoney(body: AnyPayload) {
        const amount = Number(body?.amount);
        if (!Number.isFinite(amount) || amount < 0) {
            throw new BadRequestException("amount must be a non-negative number");
        }
        const date = body?.date ? new Date(body.date) : new Date();
        return { amount, date };
    }

    async createRaw(body: CreatePayload) {
        if (!body?.userId || !isValidObjectId(body.userId)) {
            throw new BadRequestException("userId is required and must be a valid ObjectId");
        }
        if (!body?.coopId || !isValidObjectId(body.coopId)) {
            throw new BadRequestException("coopId is required and must be a valid ObjectId");
        }

        const user = new Types.ObjectId(body.userId);
        const coop = new Types.ObjectId(body.coopId);

        const buy: any[] = [];
        const credit: any[] = [];
        const orders: Types.ObjectId[] = [];

        if (body.firstBuyAmount != null) {
            const amount = Number(body.firstBuyAmount);
            if (!Number.isFinite(amount) || amount < 0) {
                throw new BadRequestException("firstBuyAmount must be a non-negative number");
            }
            const date = body.firstBuyDate ? new Date(body.firstBuyDate) : new Date();

            const entry: any = { amount, date };
            if (body.firstBuyOrderId) {
                if (!isValidObjectId(body.firstBuyOrderId)) {
                    throw new BadRequestException("firstBuyOrderId is not a valid ObjectId");
                }
                const orderObjId = new Types.ObjectId(body.firstBuyOrderId);
                entry.order = orderObjId;
                orders.push(orderObjId);
            }
            buy.push(entry);
        }

        if (body.firstCreditAmount != null) {
            const amount = Number(body.firstCreditAmount);
            if (!Number.isFinite(amount) || amount < 0) {
                throw new BadRequestException("firstCreditAmount must be a non-negative number");
            }
            const date = body.firstCreditDate ? new Date(body.firstCreditDate) : new Date();
            credit.push({ amount, date });
        }

        const totalBuy = buy.reduce((s, x) => s + (x.amount || 0), 0);
        const totalCredit = credit.reduce((s, x) => s + (x.amount || 0), 0);
        const balance = totalBuy - totalCredit;

        const doc = await this.creditModel.create({
            user,
            coop,
            buy,
            credit,
            orders,
            balance,
        });

        return doc;
    }

    async addPaymentRaw(id: string, body: AnyPayload) {
        const { amount, date } = this.parseMoney(body);

        const updated = await this.creditModel.findOneAndUpdate(
            { _id: id },
            { $push: { credit: { date, amount } }, $inc: { balance: -amount } },
            { new: true, runValidators: true }
        ).lean();

        if (!updated) throw new NotFoundException("CoopCredit not found");
        return updated;
    }

    async addBuyRaw(id: string, body: AnyPayload) {
        const { amount, date } = this.parseMoney(body);

        let order: Types.ObjectId | undefined;
        if (body?.orderId) {
            if (!isValidObjectId(body.orderId)) {
                throw new BadRequestException("orderId is not a valid ObjectId");
            }
            order = new Types.ObjectId(body.orderId);
        }

        const update: any = {
            $push: { buy: order ? { date, amount, order } : { date, amount } },
            $inc: { balance: amount },
        };
        if (order) update.$addToSet = { orders: order };

        const updated = await this.creditModel.findOneAndUpdate(
            { _id: id },
            update,
            { new: true, runValidators: true }
        ).lean();

        if (!updated) throw new NotFoundException("CoopCredit not found");
        return updated;
    }

    async recomputeBalance(id: string) {
        const doc = await this.creditModel.findById(id).lean();
        if (!doc) throw new NotFoundException("CoopCredit not found");

        const totalBuy = (doc.buy ?? []).reduce((s, x) => s + (x.amount || 0), 0);
        const totalCredit = (doc.credit ?? []).reduce((s, x) => s + (x.amount || 0), 0);
        const balance = totalBuy - totalCredit;

        await this.creditModel.updateOne({ _id: id }, { $set: { balance } });
        return { balance, totalBuy, totalCredit };
    }


    async findByCoop(coopId: string) {
        if (!isValidObjectId(coopId)) throw new BadRequestException("Invalid coopId");
        return this.creditModel.findOne({ coop: new Types.ObjectId(coopId) }).lean();
    }
}


