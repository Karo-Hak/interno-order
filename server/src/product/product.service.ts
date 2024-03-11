import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { CategoryProduct } from 'src/category-product/schema/category-product.schema';


@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(CategoryProduct.name) private categoryProductModel: Model<CategoryProduct>
  ) { }



  async create(createProductDto: CreateProductDto) {
    const findCategory = await this.categoryProductModel.findById(createProductDto.categoryProduct);
    const createdProduct = new this.productModel(createProductDto);
    console.log(createProductDto);

    await this.categoryProductModel.findByIdAndUpdate(createProductDto.categoryProduct, { product: [...findCategory.product, createdProduct.id] })
    return createdProduct.save();
  }

  async findByName(name: string) {
    return await this.productModel.findOne({ name })
  }
  async updateQuantity(updateProductDtos: UpdateProductDto) {
    for (const key in updateProductDtos) {
      if (updateProductDtos.hasOwnProperty(key)) {
        const dto = updateProductDtos[key];
        await this.productModel.updateOne({ _id: dto._id }, dto);
      }
    }

    return "all ok";
  }




  async findAll() {
    return await this.productModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }


  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
