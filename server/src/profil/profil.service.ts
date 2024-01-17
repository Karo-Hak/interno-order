import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfilDto } from './dto/create-profil.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { Profil } from './schema/profil.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
const { MongoClient } = require('mongodb');



@Injectable()
export class ProfilService {
  constructor(@InjectModel(Profil.name) private profilModel: Model<Profil>) { }

  async create(profil) {
    const profilId = profil.id
    const newPrice = profil.price
    const stockUrl = 'mongodb://localhost:27017';
    const stockClient = new MongoClient(stockUrl);
    try {
      await stockClient.connect();
      const stockDb = stockClient.db('stock');
      const stockCollection = stockDb.collection('products');
      const result = await stockCollection.updateOne(
        { _id: new ObjectId(profilId) },
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
      const profilmDb = stockData.filter(e => {
        return e.categoryProduct == "65a794201acb8962fc25c963"
      })
      return profilmDb;
    } finally {
      await stockClient.close();
    }
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
