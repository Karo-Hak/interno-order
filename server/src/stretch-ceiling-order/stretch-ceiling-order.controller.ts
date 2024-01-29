import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { StretchCeilingOrderService } from './stretch-ceiling-order.service';
import { CreateStretchCeilingOrderDto } from './dto/create-stretch-ceiling-order.dto';
import { UpdateStretchCeilingOrderDto } from './dto/update-stretch-ceiling-order.dto';
import { Response } from 'express';
import { StretchBuyerService } from 'src/stretch-buyer/stretch-buyer.service';
import { log } from 'console';


@Controller('stretch-ceiling-order')
export class StretchCeilingOrderController {
  constructor(
    private readonly stretchCeilingOrderService: StretchCeilingOrderService,
    private readonly stretchBuyerService: StretchBuyerService,
  ) { }

  @Post()
  async create(@Body() obj: any, @Res() res: Response) {
    
    try {
      let orderBuyer
      if (obj.addOrder.buyer.buyerId) {
        orderBuyer = await this.stretchBuyerService.findOne(obj.addOrder.buyer.buyerId);
        console.log(orderBuyer);
      } else {
        orderBuyer = await this.stretchBuyerService.findByPhone(obj.addOrder.buyer.buyerPhone);
        if (orderBuyer === null) {
          orderBuyer = await this.stretchBuyerService.create(obj.addOrder.buyer);
        }
      }
      const createdStretchOrder = { stretchTextureOrder: obj.addOrder.stretchTextureOrder, orderBuyer, user: obj.user }
      const stretchCeilingOrder = await this.stretchCeilingOrderService.create(createdStretchOrder);
      return res.status(HttpStatus.CREATED).json({
        message: "created",
        stretchCeilingOrder
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message
      });
    }
  }

  @Get('findNew')
  async findNew(@Res() res: Response) {
    try {
      const newOrders = await this.stretchCeilingOrderService.findNewOrders();
      return res.status(HttpStatus.OK).json(newOrders);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get()
  async findAll() {
    return await this.stretchCeilingOrderService.findAll();
  }

  @Get('findStretchOrder/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const order = await this.stretchCeilingOrderService.findOne(id);
      return res.status(HttpStatus.OK).json(order);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStretchCeilingOrderDto: UpdateStretchCeilingOrderDto) {
    return this.stretchCeilingOrderService.update(+id, updateStretchCeilingOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stretchCeilingOrderService.remove(+id);
  }
}
