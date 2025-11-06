import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { PlintWholesaleOrderService } from './plint-wholesale-order.service';
import { CreatePlintWholesaleOrderDto } from './dto/create-plint-wholesale-order.dto';
import { UpdatePlintWholesaleOrderDto } from './dto/update-plint-wholesale-order.dto';

// Простая проверка ObjectId без сторонних пайпов
const isObjectId = (s?: string) => !!s && /^[0-9a-fA-F]{24}$/.test(s);

@Controller('plint-wholesale-order')
export class PlintWholesaleOrderController {
  constructor(private readonly service: PlintWholesaleOrderService) {}

  @Post()
  create(@Body() dto: CreatePlintWholesaleOrderDto) {
    if (dto.userId && !isObjectId(dto.userId)) {
      throw new Error('userId must be a valid Mongo ObjectId');
    }
    if (dto.buyer && !isObjectId(dto.buyer)) {
      throw new Error('buyer must be a valid Mongo ObjectId');
    }
    if (dto.agent && !isObjectId(dto.agent)) {
      throw new Error('agent must be a valid Mongo ObjectId');
    }
    return this.service.create(dto, dto.userId);
  }

  @Get('report/monthly')
  monthly(@Query('month') month?: string) {
    return this.service.monthlyReport(month);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlintWholesaleOrderDto) {
    if (!isObjectId(id)) {
      throw new Error('id must be a valid Mongo ObjectId');
    }
    return this.service.update(id, dto);
  }

  @Post(':id/payments')
  addPayment(
    @Param('id') id: string,
    @Body() body: { amount: number; date?: string; userId: string },
  ) {
    if (!isObjectId(id)) {
      throw new Error('id must be a valid Mongo ObjectId');
    }
    if (!isObjectId(body.userId)) {
      throw new Error('userId must be a valid Mongo ObjectId');
    }
    return this.service.addPayment(id, body.amount, body.date, body.userId);
  }

  // 🔻 НОВОЕ: платеж по агенту (привязанный к заказу)
  @Post(':id/agent-payments')
  addAgentPayment(
    @Param('id') id: string,
    @Body() body: { amount: number; date?: string; userId: string },
  ) {
    if (!isObjectId(id)) {
      throw new Error('id must be a valid Mongo ObjectId');
    }
    if (!isObjectId(body.userId)) {
      throw new Error('userId must be a valid Mongo ObjectId');
    }
    return this.service.addAgentPayment(id, body.amount, body.date, body.userId);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    if (!isObjectId(id)) {
      throw new Error('id must be a valid Mongo ObjectId');
    }
    return this.service.cancel(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    if (!isObjectId(id)) {
      throw new Error('id must be a valid Mongo ObjectId');
    }
    return this.service.delete(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!isObjectId(id)) {
      throw new Error('id must be a valid Mongo ObjectId');
    }
    return this.service.findOne(id);
  }

  @Get()
  listByBuyer(
    @Query('buyerId') buyerId: string,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ) {
    if (!isObjectId(buyerId)) {
      throw new Error('buyerId must be a valid Mongo ObjectId');
    }
    return this.service.listByBuyer(buyerId, limit);
  }
}
