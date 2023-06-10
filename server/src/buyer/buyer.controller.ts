import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, HttpStatus, Query, Req } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Response } from 'express';


@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) { }

  @Post()
  async create(@Body() createBuyerDto: CreateBuyerDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.buyerService.create(createBuyerDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create buyer",
        data
      })
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get("allBuyer")
  async findAll(@Res() res: Response) {
    try {
      const buyer = await this.buyerService.findAll();
      return res.status(HttpStatus.OK).json(buyer);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto) {
    return this.buyerService.update(+id, updateBuyerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyerService.remove(+id);
  }
}
