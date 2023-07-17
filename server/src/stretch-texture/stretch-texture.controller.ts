import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { StretchTextureService } from './stretch-texture.service';
import { CreateStretchTextureDto } from './dto/create-stretch-texture.dto';
import { UpdateStretchTextureDto } from './dto/update-stretch-texture.dto';
import { Response } from 'express';


@Controller('stretchTexture')
export class StretchTextureController {
  constructor(private readonly stretchTextureService: StretchTextureService) { }

  @Post()
  create(@Body() createStretchTextureDto: CreateStretchTextureDto, @Res() res: Response) {
    try {
      return this.stretchTextureService.create(createStretchTextureDto);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const stretchTexture = await this.stretchTextureService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        stretchTexture
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stretchTextureService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStretchTextureDto: UpdateStretchTextureDto) {
    return this.stretchTextureService.update(+id, updateStretchTextureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stretchTextureService.remove(+id);
  }
}
