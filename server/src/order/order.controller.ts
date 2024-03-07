import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Response } from 'express';
import { BuyerService } from 'src/buyer/buyer.service';
import { TextureService } from 'src/texture/texture.service';
import { CooperateService } from 'src/cooperate/cooperate.service';


@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly buyerService: BuyerService,
    private readonly textureService: TextureService,
    private readonly cooperateService: CooperateService
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
        if (texture.name == "SAMAKLEY ABOY") {
          if (obj.newOrder.height <= 150) {
            metr = +(obj.newOrder.weight / 100 + 0.2).toFixed(2)
          } else {
            metr = +((Math.ceil(obj.newOrder.weight / 145) * (obj.newOrder.height / 100) + 0.2 + Math.ceil(obj.newOrder.weight / 100) * 0.02)).toFixed(2)
          }
        }
        if (texture.name == "SAMAKLEY") {
          if (obj.newOrder.height <= 125) {
            metr = +(obj.newOrder.weight / 100 + 0.2).toFixed(2)
          } else {
            metr = +((Math.ceil(obj.newOrder.weight / 125) * (obj.newOrder.height / 100) + 0.2 + Math.ceil(obj.newOrder.weight / 100) * 0.02)).toFixed(2)
          }
        }
        if (texture.name !== "130KTAV" && texture.name !== "320ABOY" && texture.name !=="SAMAKLEY ABOY" && texture.name !== "SAMAKLEY") {
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

  @Get('updateStatus/:id')
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

  @Post('updateWallpaper/:id')
  async updateOrder(@Body() obj: any, @Res() res: Response, @Param('id') id: string) {
    try {
      const wallpaper = await this.orderService.findWallpaper(obj.params.id)
      const checkbuyer = await this.buyerService.create(obj.buyer)
      const checkTexture = await this.textureService.findOne(obj.updateingOrder.texture)
      const checkCooperate = await this.cooperateService.findOne(obj.updateingOrder.cooperate)

      if (checkbuyer && checkbuyer._id.toString() !== wallpaper.buyer.toString()) {
        await this.buyerService.deleteFromArray(wallpaper.buyer.toString(), wallpaper.id)
      }
      if (checkTexture && checkTexture._id.toString() !== wallpaper.texture.toString()) {
        await this.textureService.deleteFromArray(wallpaper.texture.toString(), wallpaper.id)
      }
      if (checkCooperate && checkCooperate._id.toString() !== wallpaper.cooperate.toString()) {
        await this.cooperateService.deleteFromArray(wallpaper.cooperate.toString(), wallpaper.id)
      }
      if (wallpaper) {
        const updateOrderDto = await this.orderService.update(obj.params.id,
          {
            ...obj.updateingOrder,
            buyer: checkbuyer.id,
            texture: checkTexture.id,
            cooperate: checkCooperate.id
          },
          checkbuyer,
          checkTexture,
          checkCooperate)
      }
      return res.status(HttpStatus.OK).json("order updated");
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
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



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}

