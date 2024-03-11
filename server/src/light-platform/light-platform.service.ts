import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLightPlatformDto } from './dto/create-light-platform.dto';
import { UpdateLightPlatformDto } from './dto/update-light-platform.dto';
import { LightPlatform } from './schema/light-platform.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Product } from 'src/product/schema/product.schema';
const { MongoClient } = require('mongodb');

@Injectable()
export class LightPlatformService {
  constructor(
    @InjectModel(LightPlatform.name) private lightPlatformModel: Model<LightPlatform>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async createPrice(lightPlatform) {
    const productId = lightPlatform.id
    const newPrice = lightPlatform.price
    const result = await this.productModel.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { price: newPrice } }
    );
    return result;
  }

  async findAll() {
    const stockUrl = 'mongodb://localhost:27017';
    const stockClient = new MongoClient(stockUrl);

    try {
      await stockClient.connect();
      const stockDb = stockClient.db('order');
      const stockCollection = stockDb.collection('products');

      const stockData = await this.productModel.find()
      const lightPlatformDb = stockData.filter(e => {
        return e.categoryProduct.toString() === "65a63e084452458093923a8f"
      })
      return lightPlatformDb;
    } finally {
      await stockClient.close();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} lightPlatform`;
  }

  update(id: number, updateLightPlatformDto: UpdateLightPlatformDto) {

    // async function updateProductQuantity(productId, newQuantity) {
    //   const stockUrl = 'mongodb://localhost:27017';
    //   const stockClient = new MongoClient(stockUrl);

    //   try {
    //     await stockClient.connect();

    //     const stockDb = stockClient.db('stock');
    //     const stockCollection = stockDb.collection('products');

    //     // Пример запроса, изменяющего количество продукта по идентификатору
    //     const result = await stockCollection.updateOne(
    //       { _id: new ObjectId(productId) }, // Предполагается, что _id является ObjectId
    //       { $set: { quantity: newQuantity } }
    //     );

    //     console.log(result);

    //     return result;
    //   } finally {
    //     await stockClient.close();
    //   }
    // }

  }

  remove(id: number) {
    return `This action removes a #${id} lightPlatform`;
  }
}
