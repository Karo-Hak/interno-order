import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UnytService } from './unyt.service';
import { CreateUnytDto } from './dto/create-unyt.dto';
import { UpdateUnytDto } from './dto/update-unyt.dto';
import { Response } from 'express';


@Controller('unyt')
export class UnytController {
  constructor(private readonly unytService: UnytService) { }

  @Post()
  create(@Body() createUnytDto: CreateUnytDto) {
    return this.unytService.create(createUnytDto);
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const stretchUnyt = await this.unytService.findAll()
      return res.status(HttpStatus.OK).json({
        message: "ok",
        stretchUnyt
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unytService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUnytDto: UpdateUnytDto) {
    return this.unytService.update(+id, updateUnytDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unytService.remove(+id);
  }
}
