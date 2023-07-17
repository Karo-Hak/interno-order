import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BardutyunService } from './bardutyun.service';
import { CreateBardutyunDto } from './dto/create-bardutyun.dto';
import { UpdateBardutyunDto } from './dto/update-bardutyun.dto';

@Controller('bardutyun')
export class BardutyunController {
  constructor(private readonly bardutyunService: BardutyunService) {}

  @Post()
  create(@Body() createBardutyunDto: CreateBardutyunDto) {
    return this.bardutyunService.create(createBardutyunDto);
  }

  @Get()
  findAll() {
    return this.bardutyunService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bardutyunService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBardutyunDto: UpdateBardutyunDto) {
    return this.bardutyunService.update(+id, updateBardutyunDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bardutyunService.remove(+id);
  }
}
