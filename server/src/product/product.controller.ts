// src/product/product.controller.ts
import { Controller, Get, Post, Body, Patch, Param, HttpStatus, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { BuyProductDto } from './dto/buy-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    try {
      const name = await this.productService.findByName(createProductDto.name);
      if (name) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "already exists", name });
      }
      const data = await this.productService.create(createProductDto);
      return res.status(HttpStatus.CREATED).json({ message: "create product", data });
    } catch (e: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e?.message || 'Error' });
    }
  }

  @Get('by-category')
  async byCategory(@Query() dto: QueryProductDto, @Res() res: Response) {
    try {
      const data = await this.productService.findByCategory(dto);
      return res.status(HttpStatus.OK).json(data);
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e?.message || 'Bad request' });
    }
  }

  @Get('allProduct')
  async findAll(@Res() res: Response) {
    try {
      const products = await this.productService.findAll();
      return res.status(HttpStatus.OK).json({ product: products });
    } catch (e: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e?.message || 'Error' });
    }
  }

  @Post('updateQuantity')
  async updateQuantity(@Body() dto: any, @Res() res: Response) {
    try {
      const updatedProducts = await this.productService.updateQuantity(dto);
      return res.status(HttpStatus.OK).json(updatedProducts);
    } catch (e: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e?.message || 'Error' });
    }
  }

  @Post('buy')
  async buy(@Body() dto: BuyProductDto, @Res() res: Response) {
    try {
      const result = await this.productService.buy(dto);
      return res.status(HttpStatus.OK).json(result);
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: e?.message || 'Bad request' });
    }
  }

  // ✅ НОВОЕ: PATCH update одного товара
  @Patch(':id')
  async updateOne(@Param('id') id: string, @Body() dto: UpdateProductDto, @Res() res: Response) {
    try {
      const data = await this.productService.updateOne(id, dto);
      return res.status(HttpStatus.OK).json({ product: data });
    } catch (e: any) {
      return res.status(e?.status || HttpStatus.BAD_REQUEST).json({ error: e?.message || 'Bad request' });
    }
  }
}
