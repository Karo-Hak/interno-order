import { Controller, Get, Post, Request, Res, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { CooperationSphereService } from './cooperation-sphere.service';
import { CreateCooperationSphereDto } from './dto/create-cooperation-sphere.dto';
import { UpdateCooperationSphereDto } from './dto/update-cooperation-sphere.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('cooperation-sphere')
export class CooperationSphereController {
  constructor(private readonly cooperationSphereService: CooperationSphereService) { }

  @Post()
  create(@Body() createCooperationSphereDto: CreateCooperationSphereDto) {
    return this.cooperationSphereService.create(createCooperationSphereDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Res() res: Response) {
    try {
      const coopSpher = await this.cooperationSphereService.findAll();
      return res.status(HttpStatus.OK).json(coopSpher);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cooperationSphereService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCooperationSphereDto: UpdateCooperationSphereDto) {
    return this.cooperationSphereService.update(+id, updateCooperationSphereDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cooperationSphereService.remove(+id);
  }
}
