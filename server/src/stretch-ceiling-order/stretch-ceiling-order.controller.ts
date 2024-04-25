import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, Put } from '@nestjs/common';
import { StretchCeilingOrderService } from './stretch-ceiling-order.service';
import { UpdateStretchCeilingOrderDto } from './dto/update-stretch-ceiling-order.dto';
import { Response } from 'express';
import { StretchBuyerService } from 'src/stretch-buyer/stretch-buyer.service';
import { StretchWorkerService } from 'src/stretch-worker/stretch-worker.service';
import { DebetKreditService } from 'src/debet-kredit/debet-kredit.service';


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
    private readonly debetKreditService: DebetKreditService,
  ) { }

  @Post()
  async create(@Body() obj: any, @Res() res: Response) {

    try {
      let orderBuyer
      if (obj.buyer.buyerId) {
        orderBuyer = await this.stretchBuyerService.findOne(obj.buyer.buyerId);
      } else {
        orderBuyer = await this.stretchBuyerService.findByPhone(obj.buyer.buyerPhone1);
        if (orderBuyer === null) {
          orderBuyer = await this.stretchBuyerService.create(obj.buyer);
        }
      }
      if (obj.stretchTextureOrder.rooms) {
        removeEmptyValues(obj.stretchTextureOrder.rooms)
        removeEmptyObjects(obj.stretchTextureOrder.rooms)
      }
      if (obj.stretchTextureOrder.groupedWorks) {
        removeEmptyValues(obj.stretchTextureOrder.groupedWorks)
        removeEmptyObjects(obj.stretchTextureOrder.groupedWorks)
      }
      const createdStretchOrder = { stretchTextureOrder: obj.stretchTextureOrder, orderBuyer, user: obj.user }
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
  @Get('findNewMesur')
  async findMesurOrders(@Res() res: Response) {
    try {
      const newOrders = await this.stretchCeilingOrderService.findMesurOrders();
      return res.status(HttpStatus.OK).json(newOrders);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }
  @Get('findNewInstal')
  async findInstalOrders(@Res() res: Response) {
    try {
      const newOrders = await this.stretchCeilingOrderService.findInstalOrders();
      return res.status(HttpStatus.OK).json(newOrders);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Post('viewOrdersList')
  async filterOrder(@Body() obj: any, @Res() res: Response) {
    try {
      const startDate = new Date(obj.dateFilter.startDate)
      const endDate = new Date(obj.dateFilter.endDate)
      const order = await this.stretchCeilingOrderService.filterOrder(startDate, endDate)
      return res.status(HttpStatus.CREATED).json(order);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message
      });
    }
  }
  @Post('viewMaterialList')
  async filterOrderMaterial(@Body() obj: any, @Res() res: Response) {
    try {
      const startDate = new Date(obj.dateFilter.startDate)
      const endDate = new Date(obj.dateFilter.endDate)
      const order = await this.stretchCeilingOrderService.filterOrderMaterial(startDate, endDate)
      return res.status(HttpStatus.CREATED).json(order);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message
      });
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

      if (updateStretchCeilingOrderDto.stretchTextureOrder.stWorkerId) {
        orderWorker = await this.stretchWorkerService.findOne(updateStretchCeilingOrderDto.stretchTextureOrder.stWorkerId);
      }
      await this.stretchWorkerService.deleteFromArray(updatingOrder.stWorkerId, updatingOrder.id)

      if (updateStretchCeilingOrderDto.stretchTextureOrder.rooms) {
        removeEmptyValues(updateStretchCeilingOrderDto.stretchTextureOrder.rooms)
        removeEmptyObjects(updateStretchCeilingOrderDto.stretchTextureOrder.rooms)
      }
      if (updateStretchCeilingOrderDto.stretchTextureOrder.groupedWorks) {
        removeEmptyValues(updateStretchCeilingOrderDto.stretchTextureOrder.groupedWorks)
        removeEmptyObjects(updateStretchCeilingOrderDto.stretchTextureOrder.groupedWorks)
      }

      const updatedSretchOrder = await this.stretchCeilingOrderService.update(id, updateStretchCeilingOrderDto.stretchTextureOrder, orderBuyer, orderWorker, updatingOrder)
      return res.status(HttpStatus.OK).json(updatedSretchOrder);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }

  }
  @Put('updateStretchOrderStatuse/:id')
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Res() res: Response) {
    try {
      const result = await this.stretchCeilingOrderService.updateStatus(id, status);
      return res.status(HttpStatus.OK).json({
        message: 'Status updated successfully',
        result,
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message,
      });
    }
  }
  @Put('updateStretchPayed/:id')
  async updateStretchPayed(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.stretchCeilingOrderService.updateStretchPayed(id);
      return res.status(HttpStatus.OK).json({
        message: 'Status updated successfully',
        result,
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message,
      });
    }
  }


  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const deletedOrder = await this.stretchCeilingOrderService.remove(id);
      return res.status(HttpStatus.OK).json({
        message: "ok",
      });

    } catch (e) {
      console.error('An error occurred:', e);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message,
      });
    }
  }
}
