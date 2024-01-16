import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { LightPlatformService } from './light-platform.service';
import { CreateLightPlatformDto } from './dto/create-light-platform.dto';
import { UpdateLightPlatformDto } from './dto/update-light-platform.dto';
import { Response } from 'express';

@Controller('stretchLightPlatform')
export class LightPlatformController {
  constructor(private readonly lightPlatformService: LightPlatformService) { }

  @Post()
  async create(@Body() createLightPlatformDto: CreateLightPlatformDto, @Res() res: Response) {
    try {
      return await this.lightPlatformService.create(createLightPlatformDto);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const lightPlatform = await this.lightPlatformService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        lightPlatform
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lightPlatformService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLightPlatformDto: UpdateLightPlatformDto) {
    return this.lightPlatformService.update(+id, updateLightPlatformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lightPlatformService.remove(+id);
  }
}
