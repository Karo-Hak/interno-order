import { Controller, Get, Post, Request, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { TextureService } from './texture.service';
import { CreateTextureDto } from './dto/create-texture.dto';
import { UpdateTextureDto } from './dto/update-texture.dto';
import { Response } from 'express';


@Controller('texture')
export class TextureController {
  constructor(private readonly textureService: TextureService) { }

  @Post()
  async create(@Body() createTextureDto: CreateTextureDto, @Res() res: Response) {
    try {
      const data = await this.textureService.create(createTextureDto);
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

  @Get()
  async findAll(@Request() req, @Res() res: Response) {
    try {
      const texture = await this.textureService.findAll();
      return res.status(HttpStatus.OK).json(texture);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.textureService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTextureDto: UpdateTextureDto) {
    return this.textureService.update(+id, updateTextureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textureService.remove(+id);
  }
}
