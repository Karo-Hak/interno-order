import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfilDto } from './dto/create-profil.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { Profil } from './schema/profil.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
const { MongoClient } = require('mongodb');


@Injectable()
export class ProfilService {
  constructor(@InjectModel(Profil.name) private profilModel: Model<Profil>) { }

  async create(createProfilDto: CreateProfilDto) {
    const existingProfil = await this.profilModel.findOne({ name: createProfilDto.name });
    if (existingProfil) {
      throw new NotFoundException('Bardutyun already exists');
    }
    const Profil = new this.profilModel(createProfilDto);
    return Profil.save();
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
