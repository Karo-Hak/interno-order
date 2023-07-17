import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoopCeilingOrderService } from './coop-ceiling-order.service';
import { CreateCoopCeilingOrderDto } from './dto/create-coop-ceiling-order.dto';
import { UpdateCoopCeilingOrderDto } from './dto/update-coop-ceiling-order.dto';

@Controller('coop-ceiling-order')
export class CoopCeilingOrderController {
  constructor(private readonly coopCeilingOrderService: CoopCeilingOrderService) {}

  @Post()
  create(@Body() createCoopCeilingOrderDto: CreateCoopCeilingOrderDto) {
    return this.coopCeilingOrderService.create(createCoopCeilingOrderDto);
  }

  @Get()
  findAll() {
    return this.coopCeilingOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coopCeilingOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoopCeilingOrderDto: UpdateCoopCeilingOrderDto) {
    return this.coopCeilingOrderService.update(+id, updateCoopCeilingOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coopCeilingOrderService.remove(+id);
  }
}
