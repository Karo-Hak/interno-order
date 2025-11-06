// coop-ceiling-order.controller.ts
import {
  Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Res, UsePipes, ValidationPipe,
  Delete
} from '@nestjs/common';
import { CoopCeilingOrderService } from './coop-ceiling-order.service';
import { CreateCoopOrderDto, DateFilterDto } from './dto/create-coop-ceiling-order.dto';
import { UpdateCoopOrderDto } from './dto/update-coop-ceiling-order.dto';
import { Response as ExpressResponse } from 'express';

@Controller('coop-ceiling-order')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class CoopCeilingOrderController {
  constructor(private readonly service: CoopCeilingOrderService) { }

  @Post()
  async create(@Body() dto: CreateCoopOrderDto) {
    const order = await this.service.createWithBuyerResolution(dto);
    return { message: 'created', orderId: (order as any)._id };
  }

  @Get('list')
  async list(@Query() q: DateFilterDto) {
    const start = new Date(q.startDate);
    const end = new Date(q.endDate);
    return this.service.filterOrder(start, end);
  }

  @Post(':id/update')
  async update(@Param('id') id: string, @Body() dto: UpdateCoopOrderDto) {
    const order = await this.service.update(id, dto);
    return { message: 'updated', order };
  }

  // Новый REST-метод удаления
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const result = await this.service.removeTx(id);
    return { message: 'deleted', ...result };
  }

  // Оставляем старую совместимость (POST /:id/delete) — вызывает тот же сервис
  @Post(':id/delete')
  async removeLegacy(@Param('id') id: string) {
    const result = await this.service.removeTx(id);
    return { message: 'deleted', ...result };
  }

  @Get('report/monthly')
  async monthlyReport(
    @Query('month') month?: string,
    @Query('tz') tz: string = 'Asia/Yerevan',
    @Res() res?: ExpressResponse,
  ) {
    const data = await this.service.getMonthlyReport(month, tz);
    return res!.status(HttpStatus.OK).json(data);
  }

  @Get('findCoopStretchOrder/:id')
  async findOne(@Param('id') id: string) {
    const order = await this.service.findOneDetailed(id);
    return { order };
  }

  @Get()
  async findAll() {
    return await this.service.findAllWallet();
  }
}
