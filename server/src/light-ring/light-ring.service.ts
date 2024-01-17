import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLightRingDto } from './dto/create-light-ring.dto';
import { UpdateLightRingDto } from './dto/update-light-ring.dto';
import { Model } from 'mongoose';
import { LightRing } from './schema/light-ring.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
const { MongoClient } = require('mongodb');


@Injectable()
export class LightRingService {
  constructor(@InjectModel(LightRing.name) private lightRingModel: Model<LightRing>) { }

  async createPrice(lightRing) {
    const productId = lightRing.id
    const newPrice = lightRing.price
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
      const lightRingmDb = stockData.filter(e => {
        return e.categoryProduct == "65a639cb4452458093923951" || e.categoryProduct == "65a639f04452458093923955"
      })
      return lightRingmDb;
    } finally {
      await stockClient.close();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} lightRing`;
  }

  update(id: number, updateLightRingDto: UpdateLightRingDto) {
    return `This action updates a #${id} lightRing`;
  }

  remove(id: number) {
    return `This action removes a #${id} lightRing`;
  }
}
