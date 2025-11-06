import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PlintAgentDebetKredit } from './schema/plint-agent-debet-kredit.schema';



const toNum = (v: any, d = 0) => {
    const n = Number.parseFloat(String(v ?? ''));
    return Number.isFinite(n) ? n : d;
};

@Injectable()
export class PlintAgentDebetKreditService {
    constructor(
        @InjectModel(PlintAgentDebetKredit.name) private readonly model: Model<PlintAgentDebetKredit>,
    ) { }

    /** Журнал: создать запись (без влияния на балансы) */
    private async agentlogDK(params: {
        type: 'Գնում' | 'Վճարում';
        amount: number;
        buyerId: Types.ObjectId;
        agentId: Types.ObjectId;
        userId?: Types.ObjectId;
        orderId?: Types.ObjectId;
        date?: Date;
    }) {
        const { type, amount, buyerId, userId, orderId, date, agentId } = params;
        await this.model.create({
            type,
            amount,
            buyer: buyerId,
            user: userId ?? undefined,
            order: orderId ?? null,
            agent: agentId ?? null,
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