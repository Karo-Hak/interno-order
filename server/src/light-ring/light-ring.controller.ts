import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { LightRingService } from './light-ring.service';
import { CreateLightRingDto } from './dto/create-light-ring.dto';
import { UpdateLightRingDto } from './dto/update-light-ring.dto';
import { Response } from 'express';

@Controller('stretchLightRing')
export class LightRingController {
  constructor(private readonly lightRingService: LightRingService) {}

  @Post()
  async create(@Body() createLightRingDto: CreateLightRingDto, @Res() res:Response) {
    try {
      return await this.lightRingService.create(createLightRingDto);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
  async findAll(@Res() res:Response) {
    try {
      const lightRing = await this.lightRingService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        lightRing
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lightRingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLightRingDto: UpdateLightRingDto) {
    return this.lightRingService.update(+id, updateLightRingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lightRingService.remove(+id);
  }
}
