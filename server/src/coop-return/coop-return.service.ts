// src/coop-return/coop-return.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { CoopReturn } from './schema/coop-return.schema';
import { CoopStretchBuyer } from 'src/coop-stretch-buyer/schema/coop-stretch-buyer.schema';
import { CoopDebetKredit } from 'src/coop-debet-kredit/schema/coop-debet-kredit.schema';
import { CoopCeilingOrder } from 'src/coop-ceiling-order/schema/coop-ceiling-order.schema';
import { CreateCoopReturnDto } from './dto/create-coop-return.dto';

const toId = (v: string | Types.ObjectId) => (v instanceof Types.ObjectId ? v : new Types.ObjectId(v));
const num = (v: any, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
const r2 = (v: number) => Math.round(v * 100) / 100;

@Injectable()
export class CoopReturnService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(CoopReturn.name) private readonly returnModel: Model<CoopReturn>,
    @InjectModel(CoopStretchBuyer.name) private readonly buyerModel: Model<CoopStretchBuyer>,
    @InjectModel(CoopDebetKredit.name) private readonly dkModel: Model<CoopDebetKredit>,
    @InjectModel(CoopCeilingOrder.name) private readonly orderModel: Model<CoopCeilingOrder>,
  ) {}

  // ── нормализация строк
  private mapTextureRows(arr: any[] = []) {
    return (arr ?? []).map((row) => {
      const height = num(row?.height, 0);
      const width  = num(row?.width, 0);
      const qty    = r2(num(row?.qty, 0));                      // qty — единственный объём
      const price  = num(row?.price, 0);
      const sum    = r2(num(row?.sum, qty * price));
      return { name: String(row?.name ?? ''), height, width, qty, price, sum };
    });
  }
  private mapSimpleRows(arr: any[] = []) {
    return (arr ?? []).map((row) => {
      const qty   = r2(num(row?.qty, 0));
      const price = num(row?.price, 0);
      const sum   = r2(num(row?.sum, qty * price));
      return {
        name: String(row?.name ?? ''),
        qty,
        price,
        sum,
        width: 0,  // чтобы соответствовать GroupedItem
        height: 0, // чтобы соответствовать GroupedItem
      };
    });
  }
  private calcAmount(p: Partial<CoopReturn>) {
    const s = (xs?: any[]) => (Array.isArray(xs) ? xs.reduce((a, x) => a + num(x?.sum, 0), 0) : 0);
    return r2(
      s(p.groupedStretchTextureData) +
      s(p.groupedStretchProfilData)  +
      s(p.groupedLightPlatformData)  +
      s(p.groupedLightRingData)
    );
  }

  // ── создание возврата
  async create(dto: CreateCoopReturnDto) {
    const session = await this.connection.startSession();
    try {
      let created: any;
      await session.withTransaction(async () => {
        const buyer = await this.buyerModel.findById(dto.buyerId).session(session);
        if (!buyer) throw new NotFoundException('Buyer not found');

        if (dto.orderId) {
          const order = await this.orderModel.findById(dto.orderId).session(session);
          if (!order) throw new NotFoundException('Order not found');
        }

        const patch: Partial<CoopReturn> = {
          groupedStretchTextureData: this.mapTextureRows(dto.groupedStretchTextureData ?? []),
          groupedStretchProfilData : this.mapSimpleRows(dto.groupedStretchProfilData ?? []),
          groupedLightPlatformData : this.mapSimpleRows(dto.groupedLightPlatformData ?? []),
          groupedLightRingData     : this.mapSimpleRows(dto.groupedLightRingData ?? []),
          date    : dto.date ? new Date(dto.date) : new Date(),
          reason  : dto.reason ?? '',
          comment : dto.comment ?? '',
          picUrl  : Array.isArray(dto.picUrl) ? dto.picUrl : [],
          buyer   : toId(dto.buyerId),
          order   : dto.orderId ? toId(dto.orderId) : undefined,
          user    : toId(dto.userId),
        };
        const amount = this.calcAmount(patch);
        if (amount <= 0) throw new BadRequestException('Return amount must be > 0');
        patch.amount = amount;

        // DK "Վերադարձ" (order — опционален)
        const dk = await this.dkModel.create([{
          type : 'Վերադարձ',
          user : patch.user!,
          buyer: patch.buyer!,
          order: patch.order ?? null,
          amount,
          date : patch.date!,
        }], { session }).then(r => r[0]);

        // сам возврат
        (patch as any).dkId = dk._id;
        created = await this.returnModel.create([patch], { session }).then(r => r[0]);

        // привязки к покупателю:
        buyer.debetKredit.push(dk._id);                  // ссылка на DK
        buyer.returns = [...(buyer.returns ?? []), created._id]; // ссылка на возврат
        // кредит-лента (типа "зачёт"): отображаем как return
        (buyer.credit as any[]).push({
          date: patch.date!,
          sum: amount,
          ["type"]: 'return',
          dkId: null,
          returnId: created._id,
        });

        // уменьшаем долг (может уходить в минус)
        buyer.totalSum = num(buyer.totalSum, 0) - Math.abs(amount);
        await buyer.save({ session });
      });

      return { message: 'return-created', return: created };
    } finally {
      await session.endSession();
    }
  }

  // ── просмотр одного возврата
async findOne(id: string) {
  const doc = await this.returnModel
    .findById(id)
    .populate({ path: 'buyer', select: 'name phone1 phone2 region address' })
    .populate({ path: 'order', select: 'date balance' })
    .lean()
    .exec();

  if (!doc) throw new NotFoundException('Return not found');
  return doc;
}

  // ── список возвратов
// coop-return.service.ts
async list(q: { buyerId?: string; from?: string; to?: string }) {
  const filter: any = {};
  if (q.buyerId) filter.buyer = toId(q.buyerId);
  if (q.from || q.to) {
    filter.date = {};
    if (q.from) filter.date.$gte = new Date(q.from);
    if (q.to)   filter.date.$lte = new Date(q.to);
  }

  return this.returnModel
    .find(filter)
    .populate({ path: 'buyer', select: 'name phone1 phone2 region address' }) // ← имя/телефон/адреса
    .populate({ path: 'order', select: 'date balance' }) // ← чтобы при желании показать ссылку на заказ
    .sort({ date: -1 })
    .lean()
    .exec();
}


  // ── удаление возврата с аккуратным откатом всех ссылок
  async remove(id: string) {
    const session = await this.connection.startSession();
    try {
      let removed = false;
      await session.withTransaction(async () => {
        const ret = await this.returnModel.findById(id).session(session);
        if (!ret) throw new NotFoundException('Return not found');

        const buyer = await this.buyerModel.findById(ret.buyer).session(session);
        if (!buyer) throw new NotFoundException('Buyer not found');

        const amount = num(ret.amount, 0);

        // вернуть долг назад
        buyer.totalSum = num(buyer.totalSum, 0) + Math.abs(amount);

        // удалить DK (если был) и ссылку
        if ((ret as any).dkId) {
          await this.dkModel.deleteOne({ _id: (ret as any).dkId }).session(session);
          buyer.debetKredit = (buyer.debetKredit ?? []).filter(
            (x: any) => String(x) !== String((ret as any).dkId),
          );
        }

        // убрать ссылку на возврат у покупателя
        buyer.returns = (buyer.returns ?? []).filter((rid: any) => String(rid) !== String(ret._id));

        // убрать запись из кредит-ленты по returnId
        buyer.credit = (buyer.credit ?? []).filter(
          (c: any) => String(c?.returnId ?? '') !== String(ret._id),
        );

        await buyer.save({ session });
        await this.returnModel.deleteOne({ _id: ret._id }).session(session);
        removed = true;
      });
      return { removed };
    } finally {
      await session.endSession();
    }
  }
}
