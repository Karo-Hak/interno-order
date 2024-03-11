import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express'
import { CreateStretchWorkerDto } from './dto/create-stretch-worker.dto';
import { StretchWorkerService } from './stretch-worker.service';
import { UpdateStretchWorkerDto } from './dto/update-stretch-worker.dto';

@Controller('stretchWorker')
export class StretchWorkerController {
  constructor(private readonly stretchWorkerService: StretchWorkerService) { }

  @Post()
  async create(@Body() createStretchWorkerDto: CreateStretchWorkerDto, @Res() res: Response) {
    try {
      const existingStretchWorker = await this.stretchWorkerService.findByPhone(createStretchWorkerDto.stretchWorkerPhone1)
      if (existingStretchWorker) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Բնորդը գոյություն ունի"
        })
      } else {
        const stretchWorker = await this.stretchWorkerService.create(createStretchWorkerDto);
        return res.status(HttpStatus.CREATED).json({
          message: "create Worker",
          stretchWorker
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
      const worker = await this.stretchWorkerService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        worker
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stretchWorkerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStretchWorkerDto: UpdateStretchWorkerDto) {
    return this.stretchWorkerService.update(+id, updateStretchWorkerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stretchWorkerService.remove(+id);
  }
}
