import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express'
import { CreateStretchWorkDto } from './dto/create-stretch-work.dto';
import { UpdateStretchWorkDto } from './dto/update-stretch-work.dto';
import { StretchWorkService } from './stretch-work.service';

@Controller('stretchWork')
export class StretchWorkController {
  constructor(private readonly stretchWorkService: StretchWorkService) { }

  @Post()
  async create(@Body() createStretchWorkDto: CreateStretchWorkDto, @Res() res: Response) {
    try {
      const existingStretchWork = await this.stretchWorkService.findByPhone(createStretchWorkDto.workName)
      if (existingStretchWork) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "գոյություն ունի"
        })
      }
      const stretchWork = await this.stretchWorkService.create(createStretchWorkDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create Worker",
        stretchWork
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
      const work = await this.stretchWorkService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        work
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stretchWorkService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStretchWorkDto: UpdateStretchWorkDto) {
    return this.stretchWorkService.update(+id, updateStretchWorkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stretchWorkService.remove(+id);
  }
}
