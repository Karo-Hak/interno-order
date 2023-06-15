import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateBuyerDto } from 'src/buyer/dto/create-buyer.dto';
import { Response } from 'express';
import { BuyerService } from 'src/buyer/buyer.service';
import { TextureService } from 'src/texture/texture.service';


@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly buyerService: BuyerService,
    private readonly textureService: TextureService,
  ) { }

  @Post()
  async create(@Body() obj: any, @Res() res: Response) {
    try {
      const texture = await this.textureService.findOne(obj.newOrder.texture)
      let metr = 0
      if (texture) {

        if (texture.name == "130KTAV") {
          if (obj.newOrder.height <= 133) {
            metr = +(obj.newOrder.weight / 100 + 0.2).toFixed(2)
          } else {
            metr = +((Math.ceil(obj.newOrder.weight / 133) * (obj.newOrder.height / 100) + 0.2 + Math.ceil(obj.newOrder.weight / 100) * 0.02)).toFixed(2)
          }
        }
        if (texture.name == "320ABOY") {
          if (obj.newOrder.height <= 320) {
            metr = +(obj.newOrder.weight / 100 + 0.7).toFixed(2)
          } else {
            metr = +(obj.newOrder.height / 100 + 0.7).toFixed(2)
          }
        }
        if (texture.name !== "130KTAV" && texture.name !== "320ABOY") {
          if (obj.newOrder.height <= 100) {
            metr = +(obj.newOrder.weight / 100 + 0.2).toFixed(2)
          } else {
            metr = +((Math.ceil(obj.newOrder.weight / 100) * (obj.newOrder.height / 100) + 0.2 + Math.ceil(obj.newOrder.weight / 100) * 0.02)).toFixed(2)
          }
        }
      }
      const orderBuyer = await this.buyerService.findOnyByPhone(obj.buyer.phone);
      if (!orderBuyer) {
        const newBuyer = await this.buyerService.create(obj.buyer);
        const createOrderDto: CreateOrderDto = { ...obj.newOrder, buyer: newBuyer.id, metr };
        var data = await this.orderService.create(createOrderDto)
      } else {
        const createOrderDto: CreateOrderDto = { ...obj.newOrder, buyer: orderBuyer.id, metr };
        var data = await this.orderService.create(createOrderDto)
      }
      return res.status(HttpStatus.CREATED).json(data);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message
      });
    }
  }

  @Get('findNew')
  async findNew(@Res() res: Response) {
    try {
      const newOrders = await this.orderService.findNewOrders();
      return res.status(HttpStatus.OK).json(newOrders);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('findOrder/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const order = await this.orderService.findOne(id);
      return res.status(HttpStatus.OK).json(order);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get('findNewOrder/:id')
  async findOneByOldID(@Param('id') id: number, @Res() res: Response) {
    try {
      const order = await this.orderService.findOneBuoldID(id);
      return res.status(HttpStatus.OK).json(order);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Get('updateOrder/:id')
  async updateStatus(@Param('id') id: string) {
    return await this.orderService.updateStatus(id);
  }

  @Post('updatePrepayment')
  async updatePrepayment(@Body() obj: any, @Res() res: Response) {
    try {
      const order = await this.orderService.findOne(obj.params.id);
      if (order) {
        const groundTotal = order.groundTotal - obj.inputValue;
        const prepayment = order.prepayment + obj.inputValue;
        const updatedOrder = await this.orderService.updatePrepayment(obj.params.id, prepayment, groundTotal);
      }
      return res.status(HttpStatus.OK).json("order updated");
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Post('search')
  async filterOrder(@Body() obj: any, @Res() res: Response) {
    try {
      const startDate = new Date(obj.dateFilter.startDate)
      const endDate = new Date(obj.dateFilter.endDate)
      const order = await this.orderService.filterOrder(startDate, endDate)
      return res.status(HttpStatus.CREATED).json(order);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message
      });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}

