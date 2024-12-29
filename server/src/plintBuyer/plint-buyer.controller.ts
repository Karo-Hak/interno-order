import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express'
import { CreatePlintBuyerDto } from './dto/create-plint-buyer.dto';
import { UpdatePlintBuyerDto } from './dto/update-plint-buyer.dto';
import { PlintBuyerService } from './plint-buyer.service';

@Controller('plintBuyer')
export class PlintBuyerController {
  constructor(private readonly plintBuyerService: PlintBuyerService) { }

  @Post()
  async create(@Body() createPlintBuyerDto: any, @Res() res: Response) {
    try {
      const existingPlintBuyer = await this.plintBuyerService.findByPhone(createPlintBuyerDto.phone1)
      if (existingPlintBuyer) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Գնորդը գոյություն ունի"
        })
      } else {

        const plintBuyer = await this.plintBuyerService.create(createPlintBuyerDto);
        return res.status(HttpStatus.CREATED).json({
          message: "create buyer",
          plintBuyer
        })
      }
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const buyer = await this.plintBuyerService.findAll()
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
    return this.plintBuyerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlintBuyerDto: UpdatePlintBuyerDto) {
    return this.plintBuyerService.update(+id, updatePlintBuyerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plintBuyerService.remove(+id);
  }
}
