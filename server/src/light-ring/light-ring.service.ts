import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLightRingDto } from './dto/create-light-ring.dto';
import { UpdateLightRingDto } from './dto/update-light-ring.dto';
import { Model } from 'mongoose';
import { LightRing } from './schema/light-ring.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Product } from 'src/product/schema/product.schema';
const { MongoClient } = require('mongodb');


@Injectable()
export class LightRingService {
  constructor(
    @InjectModel(LightRing.name) private lightRingModel: Model<LightRing>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async createPrice(lightRing) {
    const productId = lightRing.id
    const newPrice = lightRing.price
    const result = await this.productModel.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { price: newPrice } }
    );
    return result;
  }

  async findAll() {
    const stockData = await this.productModel.find();
    
    const lightRingDb = stockData.filter(e => {
      const categoryProductString = e.categoryProduct?.toString();
      return (
        categoryProductString === "65a639cb4452458093923951" ||
        categoryProductString === "65a639f04452458093923955"
      );
    });
  
    return lightRingDb;
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
