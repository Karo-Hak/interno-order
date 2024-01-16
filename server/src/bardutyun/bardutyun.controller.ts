import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { BardutyunService } from './bardutyun.service';
import { CreateBardutyunDto } from './dto/create-bardutyun.dto';
import { UpdateBardutyunDto } from './dto/update-bardutyun.dto';
import { Response } from 'express';

@Controller('stretchBardutyun')
export class BardutyunController {
  constructor(private readonly bardutyunService: BardutyunService) { }

  @Post()
  async create(@Body() createBardutyunDto: CreateBardutyunDto, @Res() res: Response) {
    try {
      return await this.bardutyunService.create(createBardutyunDto);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const stretchBardutyun = await this.bardutyunService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        stretchBardutyun
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bardutyunService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBardutyunDto: UpdateBardutyunDto) {
    return this.bardutyunService.update(+id, updateBardutyunDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bardutyunService.remove(+id);
  }
}
