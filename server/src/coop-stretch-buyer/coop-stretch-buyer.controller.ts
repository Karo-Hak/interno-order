import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { CoopStretchBuyerService } from './coop-stretch-buyer.service';

@Controller('coopStretchBuyer')
export class CoopStretchBuyerController {
  constructor(private readonly service: CoopStretchBuyerService) { }

  @Post()
  async create(@Body() dto: any) {
    const exists = await this.service.findByPhone(dto.phone1);
    if (exists) throw new BadRequestException('Покупатель уже существует');
    const doc = await this.service.create(dto);
    return { message: 'created', buyer: doc };
  }

  @Get()
  async findAll() {
    const buyer = await this.service.findAll();
    return { message: 'ok', buyer };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /**
   * Удалить оплату (credit) по сумме и дате.
   * body: { id: string; prepayment: number|string; date: string|Date }
   */
  @Post('deleteCredit')
  @HttpCode(HttpStatus.OK)
  async deleteCredit(@Body() dto: { id: string; prepayment: number | string; date: string | Date }) {
    const amount = Number(dto.prepayment) || 0;
    const creditDate = typeof dto.date === 'string' ? new Date(dto.date) : dto.date;
    const result = await this.service.deleteCreditTx(dto.id, amount, creditDate);
    return result; // { removed: boolean }
  }

  /**
   * Установить/обновить покупку (buy) по orderId и отрегулировать totalSum.
   * body: { buyerId, sum, orderId, date? }
   */
  @Post('upsertBuy')
  async upsertBuy(@Body() dto: { buyerId: string; sum: number; orderId: string; date?: string | Date }) {
    const date = dto.date ? new Date(dto.date) : new Date();
    const res = await this.service.upsertBuyMergeSum(dto.buyerId, { date, sum: Number(dto.sum) || 0, orderId: dto.orderId });
    return res;
  }

  /**
   * Добавить оплату (credit) если её нет (date+sum), уменьшив totalSum.
   * body: { buyerId, sum, date? }
   */
  @Post('addCredit')
  async addCredit(@Body() dto: { buyerId: string; sum: number; date?: string | Date }) {
    const date = dto.date ? new Date(dto.date) : new Date();
    const ok = await this.service.addCreditIfNotExists(dto.buyerId, { date, sum: Number(dto.sum) || 0 });
    return { inserted: ok };
  }

  /**
   * Удалить одну запись buy по orderId и уменьшить totalSum на amount.
   * body: { buyerId, orderId, amount }
   */
  @Post('removeBuyByOrder')
  async removeBuy(@Body() dto: { buyerId: string; orderId: string; amount: number }) {
    const res = await this.service.removeOneBuyByOrderIdAndDecTotal(dto.buyerId, dto.orderId, Number(dto.amount) || 0);
    return res;
  }
}
