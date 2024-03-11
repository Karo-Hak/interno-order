import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    try {
      const name = await this.productService.findByName(createProductDto.name)
      if (name) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "already exists",
          name
        })
      }
      const data = await this.productService.create(createProductDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create product",
        data
      })
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get('allProduct')
  async findAll(@Res() res: Response) {
    try {
      const products = await this.productService.findAll();
      return res.status(HttpStatus.OK).json({ product: products });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
  
  @Post('updateQuantity')
  async updateQuantity(@Body() updateProductDto: UpdateProductDto, @Res() res: Response) {
    try {
      const updatedProducts = await this.productService.updateQuantity(updateProductDto)
      return res.status(HttpStatus.OK)
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }


}
