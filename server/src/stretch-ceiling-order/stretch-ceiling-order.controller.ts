import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { StretchCeilingOrderService } from './stretch-ceiling-order.service';
import { UpdateStretchCeilingOrderDto } from './dto/update-stretch-ceiling-order.dto';
import { Response } from 'express';
import { StretchBuyerService } from 'src/stretch-buyer/stretch-buyer.service';
import { StretchWorkerService } from 'src/stretch-worker/stretch-worker.service';


const removeEmptyValues = (obj: any) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      removeEmptyValues(obj[key]);
    } else if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {

      delete obj[key];
    }
  }
};
const removeEmptyObjects = (obj: any) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      removeEmptyObjects(obj[key]);
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
      }
    }
  }
};


@Controller('stretch-ceiling-order')
export class StretchCeilingOrderController {
  constructor(
    private readonly stretchCeilingOrderService: StretchCeilingOrderService,
    private readonly stretchBuyerService: StretchBuyerService,
    private readonly stretchWorkerService: StretchWorkerService,
  ) { }

  @Post()
  async create(@Body() obj: any, @Res() res: Response) {
    try {
      let orderBuyer
      if (obj.addOrder.buyer.buyerId) {
        orderBuyer = await this.stretchBuyerService.findOne(obj.addOrder.buyer.buyerId);
      } else {
        orderBuyer = await this.stretchBuyerService.findByPhone(obj.addOrder.buyer.buyerPhone1);
        if (orderBuyer === null) {
          orderBuyer = await this.stretchBuyerService.create(obj.addOrder.buyer);
        }
      }
      if (obj.addOrder.stretchTextureOrder.rooms) {
        removeEmptyValues(obj.addOrder.stretchTextureOrder.rooms)
        removeEmptyObjects(obj.addOrder.stretchTextureOrder.rooms)
      }
      if (obj.addOrder.stretchTextureOrder.groupedWorks) {
        removeEmptyValues(obj.addOrder.stretchTextureOrder.groupedWorks)
        removeEmptyObjects(obj.addOrder.stretchTextureOrder.groupedWorks)
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

  @Post('updateStretchOrder/:id')
  async update(@Param('id') id: string, @Body() updateStretchCeilingOrderDto: UpdateStretchCeilingOrderDto, @Res() res: Response) {
    try {
      const updatingOrder: any = await this.stretchCeilingOrderService.findOne(id);
      let orderBuyer = await this.stretchBuyerService.findByPhone(updateStretchCeilingOrderDto.buyer.buyerPhone1);
      if (!orderBuyer) {
        orderBuyer = await this.stretchBuyerService.create(updateStretchCeilingOrderDto.buyer)
      }
      await this.stretchBuyerService.deleteFromArray(updatingOrder.buyer._id, updatingOrder.id)
      let orderWorker = undefined
      if (updateStretchCeilingOrderDto.stretchTextureOrder.stretchWorker) {
        orderWorker = await this.stretchWorkerService.findOne(updateStretchCeilingOrderDto.stretchTextureOrder.stretchWorker);
      }
      await this.stretchWorkerService.deleteFromArray(updatingOrder.stretchWorker, updatingOrder.id)

      if (updateStretchCeilingOrderDto.stretchTextureOrder.rooms) {
        removeEmptyValues(updateStretchCeilingOrderDto.stretchTextureOrder.rooms)
        removeEmptyObjects(updateStretchCeilingOrderDto.stretchTextureOrder.rooms)
      }
      if (updateStretchCeilingOrderDto.stretchTextureOrder.groupedWorks) {
        removeEmptyValues(updateStretchCeilingOrderDto.stretchTextureOrder.groupedWorks)
        removeEmptyObjects(updateStretchCeilingOrderDto.stretchTextureOrder.groupedWorks)
      }

      const updatedSretchOrder = await this.stretchCeilingOrderService.update(id, updateStretchCeilingOrderDto.stretchTextureOrder, orderBuyer, orderWorker)
      return res.status(HttpStatus.OK).json(updatedSretchOrder);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stretchCeilingOrderService.remove(+id);
  }
}
