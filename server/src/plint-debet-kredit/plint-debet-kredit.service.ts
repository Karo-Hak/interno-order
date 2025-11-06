import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlintDebetKredit } from 'src/plint-debet-kredit/schema/plint-debet-kredit.schema';
import { PlintRetailOrder } from 'src/plint-order/schema/plint-retail-order.schema';
import { PlintBuyer } from 'src/plintBuyer/schema/plint-buyer.schema';



const toNum = (v: any, d = 0) => {
    const n = Number.parseFloat(String(v ?? ''));
    return Number.isFinite(n) ? n : d;
};

@Injectable()
export class PlintDebetKreditService {
    constructor(
        @InjectModel(PlintDebetKredit.name) private readonly model: Model<PlintDebetKredit>,
        @InjectModel(PlintBuyer.name) private readonly buyerModel: Model<PlintBuyer>,
        @InjectModel(PlintRetailOrder.name) private readonly orderModel: Model<PlintRetailOrder>,
    ) { }

    /** Журнал: создать запись (без влияния на балансы) */
    private async logDK(params: {
        type: 'Գնում' | 'Վճարում';
        amount: number;
        buyerId: Types.ObjectId;
        userId?: Types.ObjectId;
        orderId?: Types.ObjectId;
        date?: Date;
    }) {
        const { type, amount, buyerId, userId, orderId, date } = params;
        await this.model.create({
            type,
            amount,
            buyer: buyerId,
            user: userId ?? undefined,
            order: orderId ?? null,
            date: date ?? new Date(),
        });
    }

    /** Журнал: обновить сумму покупки по заказу (когда меняем totalSum) */
    private async upsertOrderPurchaseDK(orderId: Types.ObjectId, buyerId: Types.ObjectId, amount: number, userId?: Types.ObjectId, date?: Date) {
        // если запись покупки по этому заказу уже есть — обновим,
        // если нет (теоретически) — создадим.
        const res = await this.model.updateOne(
            { order: orderId, type: 'Գնում' },
            { $set: { amount, date: date ?? new Date(), buyer: buyerId, user: userId ?? undefined } },
            { upsert: true }
        );
        return res;
    }
}