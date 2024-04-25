import { UpdateLightPlatformDto } from './dto/update-light-platform.dto';
import { LightPlatform } from './schema/light-platform.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Product } from 'src/product/schema/product.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LightPlatformService {
  constructor(
    @InjectModel(LightPlatform.name) private lightPlatformModel: Model<LightPlatform>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async createPrice(lightPlatform) {
    const productId = lightPlatform.id
    const newPrice = lightPlatform.price
    const newCoopPrice = lightPlatform.coopPrice
    const result = await this.productModel.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { price: newPrice, coopPrice: newCoopPrice } }
    );

    return result;
  }

  async findAll() {
    const stockData = await this.productModel.find()
    const lightPlatformDb = stockData.filter(e => {
      return e.categoryProduct.toString() === "65a63e084452458093923a8f"
    })
    return lightPlatformDb
  }

  findOne(id: number) {
    return `This action returns a #${id} lightPlatform`;
  }

  remove(id: number) {
    return `This action removes a #${id} lightPlatform`;
  }
}
