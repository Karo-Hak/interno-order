import { Injectable } from '@nestjs/common';
import { CreateCategoryProductDto } from './dto/create-category-product.dto';
import { UpdateCategoryProductDto } from './dto/update-category-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryProduct } from './schema/category-product.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryProductService {
  constructor(@InjectModel(CategoryProduct.name) private categoryProductModel: Model<CategoryProduct>) { }


  async create(createCategoryProductDto: CreateCategoryProductDto) {
    const createdCategory = new this.categoryProductModel(createCategoryProductDto);
    return createdCategory.save();
  }

  async findByName(name: string) {
    return await this.categoryProductModel.findOne({ name })
  }

  async findAll() {
    return await this.categoryProductModel.find().populate("product")
  }

  findOne(id: number) {
    return `This action returns a #${id} categoryProduct`;
  }

  update(id: number, updateCategoryProductDto: UpdateCategoryProductDto) {
    return `This action updates a #${id} categoryProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoryProduct`;
  }
}
