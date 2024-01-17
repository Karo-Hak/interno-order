import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLightPlatformDto } from './dto/create-light-platform.dto';
import { UpdateLightPlatformDto } from './dto/update-light-platform.dto';
import { LightPlatform } from './schema/light-platform.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
const { MongoClient } = require('mongodb');

@Injectable()
export class LightPlatformService {
  constructor(@InjectModel(LightPlatform.name) private lightPlatformModel: Model<LightPlatform>) { }

  async createPrice(lightPlatform) {
    const productId = lightPlatform.id
    const newPrice = lightPlatform.price
    const stockUrl = 'mongodb://localhost:27017';
    const stockClient = new MongoClient(stockUrl);

    try {
      await stockClient.connect();
      const stockDb = stockClient.db('stock');
      const stockCollection = stockDb.collection('products');

      const result = await stockCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: { price: newPrice } }
      );

      return result;
    } finally {
      await stockClient.close();
    }

  }

  async findAll() {
    const stockUrl = 'mongodb://localhost:27017';
    const stockClient = new MongoClient(stockUrl);

    try {
      await stockClient.connect();
      const stockDb = stockClient.db('stock');
      const stockCollection = stockDb.collection('products');

      const stockData = await stockCollection.find({}).toArray();
      const lightPlatformDb = stockData.filter(e => {
        return e.categoryProduct == "65a63e084452458093923a8f"
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
