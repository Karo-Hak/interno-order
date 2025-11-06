import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Connection, isValidObjectId, Model, Types } from 'mongoose';
import { CategoryProduct } from 'src/category-product/schema/category-product.schema';
import { QueryProductDto } from './dto/query-product.dto';
import { BuyProductDto } from './dto/buy-product.dto';
import { BuyProduct } from './schema/buy-product.schema';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(CategoryProduct.name) private categoryProductModel: Model<CategoryProduct>,
    @InjectModel(BuyProduct.name) private buyProductModel: Model<BuyProduct>,
    @InjectConnection() private readonly conn: Connection,
  ) { }



  async create(createProductDto: CreateProductDto) {
    const findCategory = await this.categoryProductModel.findById(createProductDto.categoryProduct);
    const createdProduct = new this.productModel(createProductDto);
    console.log(createProductDto);

    await this.categoryProductModel.findByIdAndUpdate(createProductDto.categoryProduct, { product: [...findCategory.product, createdProduct.id] })
    return createdProduct.save();
  }

  async findByName(name: string) {
    return await this.productModel.findOne({ name })
  }
  async updateQuantity(updateProductDtos: UpdateProductDto) {
    for (const key in updateProductDtos) {
      if (updateProductDtos.hasOwnProperty(key)) {
        const dto = updateProductDtos[key];
        await this.productModel.updateOne({ _id: dto._id }, dto);
      }
    }

    return "all ok";
  }

  async findByCategory(dto: QueryProductDto) {
    const { categoryId, q, skip = 0 } = dto;

    let ids: string[] = [];
    if (Array.isArray(categoryId)) {
      ids = categoryId;
    } else if (typeof categoryId === 'string' && categoryId) {
      ids = [categoryId];
    }
    if (!ids.length) throw new BadRequestException('categoryId is required');

    for (const id of ids) {
      if (!isValidObjectId(id)) throw new BadRequestException(`Invalid category id: ${id}`);
    }

    const filter: any = { categoryProduct: ids.length > 1 ? { $in: ids } : ids[0] };
    if (q && q.trim()) {
      const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.name = rx;
    }

    const [items, total] = await Promise.all([
      this.productModel.find(filter).lean().exec(),
      this.productModel.countDocuments(filter),
    ]);

    return { items, total };
  }

  async buy(dto: BuyProductDto, createdBy?: string) {
    const { items, date, note } = dto || {};
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('items is required and must be non-empty array');
    }

    // валидация и агрегация по productId (на случай дублей)
    const incMap = new Map<string, number>();
    for (const it of items) {
      const { productId, qty } = it || ({} as any);
      if (!productId || !isValidObjectId(productId)) {
        throw new BadRequestException(`Invalid productId: ${productId}`);
      }
      const q = Number(qty);
      if (!Number.isFinite(q) || q <= 0) {
        throw new BadRequestException(`Invalid qty for ${productId}: ${qty}`);
      }
      incMap.set(productId, (incMap.get(productId) || 0) + q);
    }

    const session = await this.conn.startSession();
    session.startTransaction();
    try {
      // 1) создаём документ закупки
      const buyDoc = await this.buyProductModel.create(
        [
          {
            date: date ? new Date(date) : new Date(),
            items: Array.from(incMap, ([pid, q]) => ({
              product: new Types.ObjectId(pid),
              qty: q,
            })),
            createdBy: createdBy && isValidObjectId(createdBy) ? new Types.ObjectId(createdBy) : undefined,
            note,
          },
        ],
        { session },
      );

      // 2) одним bulkWrite инкрементируем остатки
      const ops = Array.from(incMap, ([pid, q]) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(pid) },
          update: { $inc: { quantity: q } },
        },
      }));
      const bulkRes = await this.productModel.bulkWrite(ops, { ordered: false, session });

      await session.commitTransaction();
      session.endSession();

      return {
        ok: true,
        buyId: buyDoc[0]._id,
        matched: bulkRes.matchedCount ?? 0,
        modified: bulkRes.modifiedCount ?? 0,
        upserts: bulkRes.upsertedCount ?? 0,
        items: incMap.size,
      };
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }



  async findAll() {
    return await this.productModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }


  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}