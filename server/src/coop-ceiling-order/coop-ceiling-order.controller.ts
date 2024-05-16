import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { CoopCeilingOrderService } from './coop-ceiling-order.service';
import { CreateCoopCeilingOrderDto } from './dto/create-coop-ceiling-order.dto';
import { UpdateCoopCeilingOrderDto } from './dto/update-coop-ceiling-order.dto';
import { Response } from 'express';
import { StretchBuyerService } from 'src/stretch-buyer/stretch-buyer.service';
import { CoopStretchBuyerService } from 'src/coop-stretch-buyer/coop-stretch-buyer.service';


@Controller('coop-ceiling-order')
export class CoopCeilingOrderController {
  constructor(
    private readonly coopCeilingOrderService: CoopCeilingOrderService,
    private readonly coopStretchBuyerService: CoopStretchBuyerService,

  ) {
  }

  @Post()
  async create(@Body() obj: any, @Res() res: Response) {
    try {
      let buyer
      if (obj.buyer.buyerId) {
        buyer = await this.coopStretchBuyerService.findOne(obj.buyer.buyerId);
      } else {
        buyer = await this.coopStretchBuyerService.findByPhone(obj.buyer.phone1);
        if (buyer === null) {
          buyer = await this.coopStretchBuyerService.create(obj.buyer);
        }
      }
      const createdStretchOrder = { stretchTextureOrder: obj.stretchTextureOrder, buyer, user: obj.user }
      const stretchCeilingOrder = await this.coopCeilingOrderService.create(createdStretchOrder);
      return res.status(HttpStatus.CREATED).json({
        message: "created",
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message
      });
    }

    // return this.coopCeilingOrderService.create(createCoopCeilingOrderDto);
  }

  @Post('viewCoopOrdersList')
  async filterOrder(@Body() obj: any, @Res() res: Response) {
    try {
      const startDate = new Date(obj.dateFilter.startDate)
      const endDate = new Date(obj.dateFilter.endDate)
      const order = await this.coopCeilingOrderService.filterOrder(startDate, endDate)
      return res.status(HttpStatus.CREATED).json(order);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message
      });
    }
  }

  @Get('findCoopStretchOrder/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const order = await this.coopCeilingOrderService.findOne(id);
      return res.status(HttpStatus.OK).json({order});
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get()
  findAll() {
    return this.coopCeilingOrderService.findAll();
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
