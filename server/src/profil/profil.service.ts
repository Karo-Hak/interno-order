import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfilDto } from './dto/create-profil.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { Profil } from './schema/profil.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Product } from 'src/product/schema/product.schema';
const { MongoClient } = require('mongodb');



@Injectable()
export class ProfilService {
  constructor(
    @InjectModel(Profil.name) private profilModel: Model<Profil>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }
  async create(profil) {
    const profilId = profil.id
    const newPrice = profil.price
    const newCoopPrice = profil.coopPrice
    const result = await this.productModel.updateOne(
      { _id: new ObjectId(profilId) },
      { $set: { price: newPrice, coopPrice: newCoopPrice } }
    );
    return result;
  }

  async findAll() {
    const stockData = await this.productModel.find()
    const profilmDb = stockData.filter(e => {
      return e.categoryProduct.toString() === "65a794201acb8962fc25c963"
    })
    return profilmDb;
  }

  findOne(id: number) {
    return `This action returns a #${id} profil`;
  }

  update(id: number, updateProfilDto: UpdateProfilDto) {
    return `This action updates a #${id} profil`;
  }

  remove(id: number) {
    return `This action removes a #${id} profil`;
  }
}
