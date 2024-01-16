import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { CoopStretchBuyerService } from './coop-stretch-buyer.service';
import { CreateCoopStretchBuyerDto } from './dto/create-coop-stretch-buyer.dto';
import { UpdateCoopStretchBuyerDto } from './dto/update-coop-stretch-buyer.dto';
import { Response } from 'express';

@Controller('coopstretchbuyer')
export class CoopStretchBuyerController {
  constructor(private readonly coopStretchBuyerService: CoopStretchBuyerService) { }

  @Post()
  async create(@Body() createCoopStretchBuyerDto: CreateCoopStretchBuyerDto, @Res() res: Response) {
    try {
      const existingCoopStretchBuyer = await this.coopStretchBuyerService.findByPhone(createCoopStretchBuyerDto.phone)
      if (existingCoopStretchBuyer) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Բնորդը գոյություն ունի"
        })
      }
      const coopStretchBuyer = await this.coopStretchBuyerService.create(createCoopStretchBuyerDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create buyer",
        coopStretchBuyer
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const coopBuyer = await this.coopStretchBuyerService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        coopBuyer
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coopStretchBuyerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoopStretchBuyerDto: UpdateCoopStretchBuyerDto) {
    return this.coopStretchBuyerService.update(+id, updateCoopStretchBuyerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coopStretchBuyerService.remove(+id);
  }
}
