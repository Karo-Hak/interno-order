import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlintProductionService } from './plint-production.service';
import { CreatePlintProductionDto } from './dto/create-plint-production.dto';
import { UpdatePlintProductionDto } from './dto/update-plint-production.dto';
import { QueryPlintProductionDto } from './dto/query-plint-production.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('plint-production')
export class PlintProductionController {
  constructor(private readonly service: PlintProductionService) {}

  @Post()
  create(@Body() dto: CreatePlintProductionDto) {
    
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() q: QueryPlintProductionDto) {
    return this.service.findAll(q);
  }

  @Get('stats/total')
  stats(@Query('plint') plint?: string, @Query('dateFrom') dateFrom?: string, @Query('dateTo') dateTo?: string) {
    return this.service.statsTotal({ plint, dateFrom, dateTo });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlintProductionDto) {
    if (!dto || Object.keys(dto).length === 0) throw new BadRequestException('Empty update payload');
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}