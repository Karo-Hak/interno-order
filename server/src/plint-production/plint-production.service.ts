import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { PlintProduction, PlintProductionDocument } from './schema/plint-production.schema';
import { CreatePlintProductionDto } from './dto/create-plint-production.dto';
import { UpdatePlintProductionDto } from './dto/update-plint-production.dto';
import { PlintProduct, PlintProductDocument } from 'src/plint-product/schema/plint-product.schema';

@Injectable()
export class PlintProductionService {
  constructor(
    @InjectModel(PlintProduction.name) private readonly model: Model<PlintProductionDocument>,
    @InjectModel(PlintProduct.name) private readonly plintModel: Model<PlintProductDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) { }

  async create(dto: CreatePlintProductionDto) {
    const qty = Number(dto.quantity);

    if (!Number.isFinite(qty)) {
      throw new BadRequestException('quantity must be a number');
    }
    if (qty <= 0) {
      throw new BadRequestException('quantity must be > 0');
    }
    if (!dto.plint) {
      throw new BadRequestException('plint is required');
    }

    const session = await this.connection.startSession();
    try {
      let created: PlintProductionDocument | null = null;

      await session.withTransaction(async () => {
        // 1) Проверяем, что плінт существует
        const plint = await this.plintModel.findById(dto.plint).session(session);
        if (!plint) {
          throw new NotFoundException('Plint not found');
        }

        // 2) Атомарно увеличиваем остаток
        const updatedPlint = await this.plintModel.findByIdAndUpdate(
          plint._id,
          { $inc: { stockBalance: qty } },
          { new: true, session },
        );
        if (!updatedPlint) {
          throw new NotFoundException('Plint not found after update');
        }

        // 3) Создаём запись производства в той же транзакции
        const docs = await this.model.create(
          [
            {
              ...dto,
              plint: plint._id, // гарантируем корректный ObjectId
              quantity: qty,
            },
          ],
          { session },
        );
        created = docs[0];
      });

      // опционально — populate перед возвратом
      return await this.model
        .findById(created!._id)
        .populate('plint') // если в схеме есть ref
        .lean()
        .exec();
    } finally {
      session.endSession();
    }
  }


  async findAll(q?: any) {
    const { skip = 0, limit = 200 } = q || {};
    const items = await this.model
      .find()
      .populate('plint', 'name')
      .populate('user', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return { items, total: items.length };
  }

  async findOne(id: string) {
    const doc = await this.model.findById(id).populate('plint user').lean();
    if (!doc) throw new NotFoundException('Production not found');
    return doc;
  }

  async update(id: string, dto: UpdatePlintProductionDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Production not found');
    return updated;
  }

  async remove(id: string) {
    const session = await this.connection.startSession();
    try {
      let deleted = false;

      await session.withTransaction(async () => {
        // 1) Находим запись производства (нужны plint и quantity)
        const prod = await this.model.findById(id).session(session);
        if (!prod) throw new NotFoundException('Production not found');

        const qty = Number(prod.quantity) || 0;
        const plintId = prod.plint;

        // 2) Атомарно уменьшаем остаток; не даём уйти в минус
        if (qty > 0) {
          const upd = await this.plintModel.findOneAndUpdate(
            { _id: plintId, stockBalance: { $gte: qty } }, // защита от минуса
            { $inc: { stockBalance: -qty } },
            { new: true, session },
          );

          if (!upd) {
            throw new BadRequestException('Not enough stock to remove production');
          }
        }

        // 3) Удаляем сам документ производства
        await this.model.deleteOne({ _id: id }).session(session);
        deleted = true;
      });

      if (!deleted) throw new NotFoundException('Production not found');
      return { ok: true, id };
    } finally {
      session.endSession();
    }
  }
  async statsTotal(params: { plint?: string; dateFrom?: string; dateTo?: string }) {
    const { plint, dateFrom, dateTo } = params || {};
    const match: any = {};

    // фильтр по плинту
    if (plint) {
      if (!Types.ObjectId.isValid(plint)) {
        throw new BadRequestException('Invalid plint id');
      }
      match.plint = new Types.ObjectId(plint);
    }

    // фильтр по дате (включая границы, день/дата без времени обрабатываются красиво)
    if (dateFrom || dateTo) {
      const range: any = {};
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (isNaN(from.getTime())) throw new BadRequestException('Invalid dateFrom');
        // начало дня
        from.setHours(0, 0, 0, 0);
        range.$gte = from;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        if (isNaN(to.getTime())) throw new BadRequestException('Invalid dateTo');
        // конец дня
        to.setHours(23, 59, 59, 999);
        range.$lte = to;
      }
      match.date = range;
    }

    const [agg] = await this.model.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalQty: { $sum: { $ifNull: ['$quantity', 0] } },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalQty: agg?.totalQty ?? 0,
      count: agg?.count ?? 0,
      // опционально можно вернуть применённые фильтры для дебага:
      // filters: { plint: plint ?? null, dateFrom: dateFrom ?? null, dateTo: dateTo ?? null },
    };
  }
}
