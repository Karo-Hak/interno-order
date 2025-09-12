import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { PlintProductService } from './plint-product.service';
import { CreatePlintProductDto } from './dto/create-plint-product.dto';
import { UpdatePlintProductDto } from './dto/update-plint-product.dto';
import { Response } from 'express';
import { Types } from 'mongoose';



@Controller('plint')
export class PlintProductController {
  constructor(private readonly plintProductService: PlintProductService) { }

  @Post()
  async create(@Body() createPlintProductDto: CreatePlintProductDto, @Res() res: Response) {

    try {
      const name = await this.plintProductService.findByName(createPlintProductDto.name)
      console.log(name);

      if (name) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "already exists",
          name
        })
      }
      const data = await this.plintProductService.create(createPlintProductDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create plint",
        data
      })
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }
  @Post('update')
  async update(@Body() createPlintProductDto: Record<string, number>, @Res() res: Response) {
    try {
      await this.plintProductService.update(createPlintProductDto);
      return res.status(HttpStatus.OK).json({ message: "ok" });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }


  @Post('updatePrice')
  async updatePrice(
    @Body() createPlintProductDto: any,
    @Res() res: Response
  ) {
    try {
      console.log('Полученные данные DTO:', createPlintProductDto);
  
      // Проверка _id перед запросом
      if (!Types.ObjectId.isValid(createPlintProductDto._id)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ error: "Неверный формат ObjectId" });
      }
  
      await this.plintProductService.updatePrice(createPlintProductDto);
  
      return res.status(HttpStatus.OK).json({ message: "Цены успешно обновлены" });
    } catch (error) {
      console.error('Ошибка при обновлении цен:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
  



  @Get('allPlint')
  async findAll(@Res() res: Response) {
    try {
      const plints = await this.plintProductService.findAll();
      return res.status(HttpStatus.OK).json({ plint: plints });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

}
