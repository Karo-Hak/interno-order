import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { StretchBuyerService } from './stretch-buyer.service';
import { CreateStretchBuyerDto } from './dto/create-stretch-buyer.dto';
import { Response } from 'express'
import { DebetKreditService } from 'src/debet-kredit/debet-kredit.service';
import { Types } from 'mongoose';
import { asObjectId } from 'src/common/mongo/objectid';

type IdLike = string | Types.ObjectId;

@Controller('stretchBuyer')
export class StretchBuyerController {
  constructor(
    private readonly stretchBuyerService: StretchBuyerService,
    private readonly debetKreditService: DebetKreditService,
  ) { }

  @Post()
  async create(@Body() createStretchBuyerDto: CreateStretchBuyerDto, @Res() res: Response) {
    try {
      const existingStretchBuyer = await this.stretchBuyerService.findByPhone(createStretchBuyerDto.phone)
      if (existingStretchBuyer) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Բնորդը գոյություն ունի"
        })
      }
      const stretchBuyer = await this.stretchBuyerService.create(createStretchBuyerDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create buyer",
        stretchBuyer
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const buyer = await this.stretchBuyerService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        buyer
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stretchBuyerService.findOne(id);
  }

  @Post('deleteCredit')
  async deleteCredit(
    @Body() dto: { id: string; prepayment: number | string; date: string | Date, orderId: IdLike },
    @Res() res: Response,
  ) {
    try {
      const amount = Number(dto.prepayment) || 0;
      const creditDate = typeof dto.date === 'string' ? new Date(dto.date) : dto.date;
      const orderId = asObjectId("orderId", dto.orderId)

      // 1) cначала — удалить запись в buyer.credit (+ totalSum)
      const creditResult = await this.stretchBuyerService.deleteCreditTx(dto.id, amount, creditDate, orderId);

      // 2) затем — удалить соответствующую запись DK type="Վճարում"
      const tries: Array<'minute' | 'hour' | 'day'> = ['minute', 'hour', 'day'];
      let dkRemoved = false;
      let dkId: string | undefined;

      for (const matchBy of tries) {
        const r = await this.debetKreditService.removeOnePaymentByCriteria(
          { buyerId: dto.id, amount, date: creditDate, matchBy, order: orderId }
        );
        if (r.removed) { dkRemoved = true; dkId = r.dkId; break; }
      }

      return res.status(HttpStatus.OK).json({
        removedCredit: creditResult.removed,
        removedDK: dkRemoved,
        dkId: dkId ?? null,
      });
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

}

