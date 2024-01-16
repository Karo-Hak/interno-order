import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { StretchBuyerService } from './stretch-buyer.service';
import { CreateStretchBuyerDto } from './dto/create-stretch-buyer.dto';
import { UpdateStretchBuyerDto } from './dto/update-stretch-buyer.dto';
import { Response } from 'express'

@Controller('stretchBuyer')
export class StretchBuyerController {
  constructor(private readonly stretchBuyerService: StretchBuyerService) { }

  @Post()
  async create(@Body() createStretchBuyerDto: CreateStretchBuyerDto, @Res() res: Response) {
    try {
      const existingStretchBuyer = await this.stretchBuyerService.findByPhone(createStretchBuyerDto.phone)
      if (existingStretchBuyer) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Բնորդը գոյություն ունի"
        })
      }
      const stretchBuyer = await this.stretchBuyerService.create(createStretchBuyerDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create buyer",
        stretchBuyer
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
 async findAll( @Res() res: Response) {
    try {
      const buyer = await this.stretchBuyerService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        buyer
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stretchBuyerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStretchBuyerDto: UpdateStretchBuyerDto) {
    return this.stretchBuyerService.update(+id, updateStretchBuyerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stretchBuyerService.remove(+id);
  }
}
