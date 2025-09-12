import { Injectable } from '@nestjs/common';
import { CreatePlintProductDto } from './dto/create-plint-product.dto';
import { UpdatePlintProductDto } from './dto/update-plint-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PlintProduct } from './schema/plint-product.schema';
import { Model } from 'mongoose';
import { Types } from 'mongoose';


@Injectable()
export class PlintProductService {
  constructor(@InjectModel(PlintProduct.name) private plintProductModel: Model<PlintProduct>) { }


  async create(createPlintProductDto: CreatePlintProductDto) {
    const createdPlint = new this.plintProductModel(createPlintProductDto);
    return createdPlint.save();
  }

  async findByName(name: string) {
    return await this.plintProductModel.findOne({ name })
  }
  async findById(id: string) {
    return await this.plintProductModel.findById(id)
  }

  async findAll() {
    return await this.plintProductModel.find()
  }


  async findByIds(ids: any[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Invalid input: ids must be a non-empty array');
    }
  
    // Проверяем, что каждый id валидный
    const validIds = ids.filter(id => Types.ObjectId.isValid(id));
  
    if (validIds.length === 0) {
      throw new Error('No valid ids provided');
    }
  
    return this.plintProductModel.find({ _id: { $in: validIds } });
  }
  

  async update(updatePlintProductDto: Record<string, number>) {
    const updatePromises = Object.entries(updatePlintProductDto).map(([id, quantity]) => {
      return this.plintProductModel.updateOne(
        { _id: id },
        { $set: { quantity } }
      );
    });
    await Promise.all(updatePromises);
    return updatePromises;
  }
  
  async updatePrice(updatePlintProductDto: { _id: string; price1: number; price2: number }) {
    const { _id, price1, price2 } = updatePlintProductDto;
  
    if (!Types.ObjectId.isValid(_id)) {
      throw new Error(`Неверный ObjectId: ${_id}`);
    }
  
    return this.plintProductModel.updateOne(
      { _id: new Types.ObjectId(_id) }, // Преобразование в ObjectId
      { $set: { price1, price2 } }
    );
  }
  
  

  async updateProductQuantity(id: string, newQuantity: number) {
    return this.plintProductModel.updateOne({ _id: id }, { $set: { quantity: newQuantity } });
  }
  
  


}
