import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { AdditionalService } from './additional.service';
import { CreateAdditionalDto } from './dto/create-additional.dto';
import { UpdateAdditionalDto } from './dto/update-additional.dto';
import { Response } from 'express';


@Controller('/stretchAdditional')
export class AdditionalController {
  constructor(private readonly additionalService: AdditionalService) { }

  @Post()
  async create(@Body() createAdditionalDto: CreateAdditionalDto, @Res() res: Response) {
    try {
      return await this.additionalService.create(createAdditionalDto);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
 async findAll(@Res() res: Response) {
  try {
    const stretchAdditional = await this.additionalService.findAll()
    return res.status(HttpStatus.OK).json({
      messege: "ok",
      stretchAdditional
    })
  } catch (e) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      error: e.message
    })
  }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.additionalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdditionalDto: UpdateAdditionalDto) {
    return this.additionalService.update(+id, updateAdditionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.additionalService.remove(+id);
  }
}
