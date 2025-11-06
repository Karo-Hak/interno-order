import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlintProductDto } from './dto/create-plint-product.dto';
import { UpdatePlintProductDto } from './dto/update-plint-product.dto';
import { PlintProduct, PlintProductDocument } from './schema/plint-product.schema';

const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;
const escapeRegex = (input = '') => String(input).replace(ESCAPE_REGEX, '\\$&');


@Injectable()
export class PlintProductService {
  constructor(
    @InjectModel(PlintProduct.name)
    private readonly model: Model<PlintProductDocument>,
  ) { }

async create(dto: CreatePlintProductDto) {
    try {
      return await this.model.create(dto);
    } catch (e: any) {
      if (e?.code === 11000) {
        throw new ConflictException('Product with this name already exists');
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdatePlintProductDto) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('Empty update payload');
    }
    const doc = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!doc) throw new NotFoundException('Plint product not found');
    return doc;
  }

  /** Специально для апдейта цен (использует тот же UpdatePlintProductDto, но берёт только нужные поля) */
  async updatePrices(id: string, dto: UpdatePlintProductDto) {
    const payload: UpdatePlintProductDto = {};
    if (typeof dto.retailPriceAMD === 'number') payload.retailPriceAMD = dto.retailPriceAMD;
    if (typeof dto.wholesalePriceAMD === 'number') payload.wholesalePriceAMD = dto.wholesalePriceAMD;
    if (Object.keys(payload).length === 0) {
      throw new BadRequestException('Nothing to update: provide retailPriceAMD and/or wholesalePriceAMD');
    }
    return this.update(id, payload);
  }



  async allPlint(params?: { q?: string; limit?: number; skip?: number }) {
    const { q, limit = 200, skip = 0 } = params || {};
    const filter: any = {};
    if (q && q.trim()) {
      filter.name = { $regex: escapeRegex(q.trim().slice(0, 100)), $options: 'i' };
    }

    const docs = await this.model
      .find(filter, { name: 1, retailPriceAMD: 1, wholesalePriceAMD: 1, stockBalance: 1 })
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return { plint: docs };
  }

  findAll(q?: string) {
    const filter: any = {};
    if (q && q.trim()) {
      filter.name = { $regex: escapeRegex(q.trim().slice(0, 100)), $options: 'i' };
    }
    return this.model.find(filter).sort({ name: 1 }).lean();
  }
  async findOne(id: string) {
    const doc = await this.model.findById(id).lean();
    if (!doc) throw new NotFoundException('Plint product not found');
    return doc;
  }


  async remove(id: string) {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Plint product not found');
    return { ok: true };
  }

  async adjustStock(id: string, delta: number) {
    if (!Number.isInteger(delta)) throw new BadRequestException('delta must be integer');
    const doc = await this.model.findOneAndUpdate(
      { _id: id, ...(delta < 0 ? { stockBalance: { $gte: -delta } } : {}) },
      { $inc: { stockBalance: delta } },
      { new: true },
    );
    if (!doc) throw new BadRequestException('Not enough stock or plint product not found');
    return doc;
  }
}
