import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LightRingService } from './light-ring.service';
import { CreateLightRingDto } from './dto/create-light-ring.dto';
import { UpdateLightRingDto } from './dto/update-light-ring.dto';

@Controller('light-ring')
export class LightRingController {
  constructor(private readonly lightRingService: LightRingService) {}

  @Post()
  create(@Body() createLightRingDto: CreateLightRingDto) {
    return this.lightRingService.create(createLightRingDto);
  }

  @Get()
  findAll() {
    return this.lightRingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lightRingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLightRingDto: UpdateLightRingDto) {
    return this.lightRingService.update(+id, updateLightRingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lightRingService.remove(+id);
  }
}
