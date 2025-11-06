import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlintRetailOrderService } from './plint-retail-order.service';
import { CreatePlintRetailOrderDto } from './dto/create-plint-retail-order.dto';
import { UpdatePlintRetailOrderDto } from './dto/update-plint-retail-order.dto';

@Controller('plint-retail-order')
export class PlintRetailOrderController {
  constructor(private readonly service: PlintRetailOrderService) { }

  @Post()
  create(@Body() dto: CreatePlintRetailOrderDto) {
    return this.service.create(dto, dto.userId);
  }

  @Get('report/monthly')
  monthly(@Query('month') month?: string) {
    return this.service.monthlyReport(month);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlintRetailOrderDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() body: { amount: number; date?: string, userId: string }) {
    return this.service.addPayment(id, body.amount, body.date, body.userId);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }

  // 👇 НОВОЕ: жёсткое удаление
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get()
  listByBuyer(@Query('buyerId') buyerId: string, @Query('limit') limit?: string) {
    return this.service.listByBuyer(buyerId, Number(limit) || 100);
  }
}
