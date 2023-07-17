import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LightPlatformService } from './light-platform.service';
import { CreateLightPlatformDto } from './dto/create-light-platform.dto';
import { UpdateLightPlatformDto } from './dto/update-light-platform.dto';

@Controller('light-platform')
export class LightPlatformController {
  constructor(private readonly lightPlatformService: LightPlatformService) {}

  @Post()
  create(@Body() createLightPlatformDto: CreateLightPlatformDto) {
    return this.lightPlatformService.create(createLightPlatformDto);
  }

  @Get()
  findAll() {
    return this.lightPlatformService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lightPlatformService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLightPlatformDto: UpdateLightPlatformDto) {
    return this.lightPlatformService.update(+id, updateLightPlatformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lightPlatformService.remove(+id);
  }
}
