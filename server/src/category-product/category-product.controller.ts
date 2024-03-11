import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { CategoryProductService } from './category-product.service';
import { CreateCategoryProductDto } from './dto/create-category-product.dto';
import { UpdateCategoryProductDto } from './dto/update-category-product.dto';
import { Response } from 'express';


@Controller('category')
export class CategoryProductController {
  constructor(private readonly categoryProductService: CategoryProductService) { }

  @Post()
  async create(@Body() createCategoryProductDto: CreateCategoryProductDto, @Res() res: Response) {
    try {
      const name = await this.categoryProductService.findByName(createCategoryProductDto.name)
      if (name) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "already exists",
          name
        })
      }
      const data = await this.categoryProductService.create(createCategoryProductDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create category",
        data
      })
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get('allCategory')
  async findAll(@Res() res: Response) {
    try {
      const categories = await this.categoryProductService.findAll();
      return res.status(HttpStatus.OK).json({ category: categories });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryProductDto: UpdateCategoryProductDto) {
    return this.categoryProductService.update(+id, updateCategoryProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryProductService.remove(+id);
  }
}
