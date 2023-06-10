import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, HttpStatus, Query, Req } from '@nestjs/common';
import { Response } from 'express';
import { CooperateService } from './cooperate.service';
import { CreateCooperateDto } from './dto/create-cooperate.dto';
import { UpdateCooperateDto } from './dto/update-cooperate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cooperate')
export class CooperateController {
  constructor(private readonly cooperateService: CooperateService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCooperateDto: CreateCooperateDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.cooperateService.create(createCooperateDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create cooperate",
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
      const cooperate = await this.cooperateService.findAll();
      return res.status(HttpStatus.OK).json(cooperate);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cooperateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperateDto: UpdateCooperateDto) {
    return this.cooperateService.update(+id, updateCooperateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperateService.remove(+id);
  }
}
