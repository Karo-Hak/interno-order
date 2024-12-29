import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { Response } from 'express';
import { PlintBuyerService } from 'src/plintBuyer/plint-buyer.service';
import { PlintOrderService } from './plint-order.service';
import { UpdatePlintOrderDto } from './dto/update-plint-order.dto';
import { PlintProductService } from 'src/plint-product/plint-product.service';


@Controller('plintOrder')
export class PlintOrderController {
  constructor(
    private readonly plintOrderService: PlintOrderService,
    private readonly plintBuyerService: PlintBuyerService,
    private readonly plintProductService: PlintProductService

  ) {
  }

  @Post()
  async create(@Body() obj: any, @Res() res: Response) {
    try {

      let buyer
      if (obj.buyer.buyerId) {
        buyer = await this.plintBuyerService.findOne(obj.buyer.buyerId);
      } else {
        buyer = await this.plintBuyerService.findByPhone(obj.buyer.phone1);
        if (buyer === null) {
          buyer = await this.plintBuyerService.create(obj.buyer);
        }
      }
      const createdPlinthOrder = { plintOrder: obj.plintOrder, buyer, user: obj.user }
      const plintOrder = await this.plintOrderService.create(createdPlinthOrder);
      return res.status(HttpStatus.CREATED).json({
        message: "created",
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message
      });
    }

  }


  @Post('update/:id')
  async update(@Param('id') id: string, @Body() updatePlintOrderDto: UpdatePlintOrderDto, @Res() res: Response) {
    try {
      const updatingOrder: any = await this.plintOrderService.findOne(id);
      // let orderBuyer = await this.plintBuyerService.findByPhone(updatePlintOrderDto.buyer.buyerPhone1);
      // if (!orderBuyer) {
      //   orderBuyer = await this.plintBuyerService.create(updatePlintOrderDto.buyer)
      // }
      // await this.plintBuyerService.deleteFromArray(updatingOrder.buyer._id, updatingOrder.id)
      // let orderWorker = undefined

      // if (updatePlintOrderDto.plintOrder) {
      //   orderWorker = await this.stretchWorkerService.findOne(updateStretchCeilingOrderDto.stretchTextureOrder.stWorkerId);
      // }
      // await this.stretchWorkerService.deleteFromArray(updatingOrder.stWorkerId, updatingOrder.id)

      // if (updateStretchCeilingOrderDto.stretchTextureOrder.rooms) {
      //   removeEmptyValues(updateStretchCeilingOrderDto.stretchTextureOrder.rooms)
      //   removeEmptyObjects(updateStretchCeilingOrderDto.stretchTextureOrder.rooms)
      // }
      // if (updateStretchCeilingOrderDto.stretchTextureOrder.groupedWorks) {
      //   removeEmptyValues(updateStretchCeilingOrderDto.stretchTextureOrder.groupedWorks)
      //   removeEmptyObjects(updateStretchCeilingOrderDto.stretchTextureOrder.groupedWorks)
      // }

      const updatedPlintOrder = await this.plintOrderService.update(id, updatePlintOrderDto)
      return res.status(HttpStatus.OK).json(updatedPlintOrder);
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }

  }

  @Get('findNew')
  async findNew(@Res() res: Response) {
    try {
      const newOrders = await this.plintOrderService.findNewOrders();
      return res.status(HttpStatus.OK).json({ plint: newOrders });
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Post('viewPlintOrdersList')
  async filterOrder(@Body() obj: any, @Res() res: Response) {
    try {
      const startDate = new Date(obj.dateFilter.startDate)
      const endDate = new Date(obj.dateFilter.endDate)
      const order = await this.plintOrderService.filterOrder(startDate, endDate)
      return res.status(HttpStatus.CREATED).json(order);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: e.message
      });
    }
  }

  @Get('findPlintOrder/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const order = await this.plintOrderService.findOne(id);
      return res.status(HttpStatus.OK).json({ order });
    } catch (e) {
      return res.status(HttpStatus.OK).json({
        error: e.message
      })
    }
  }

  @Put('updateStatus/:id')
  async updateStretchPayed(@Param('id') id: string, @Res() res: Response) {
    try {
      const result = await this.plintOrderService.updateStatus(id);
      const idArray = result.groupedPlintData.map((key: any) => key.id);
      const products = await this.plintProductService.findByIds(idArray);
      const updatingQuantity = {}
      result.groupedPlintData.forEach((key: any) => {
        products.forEach((product: any) => {
          if (key.id.toString() === product._id.toString()) {
            updatingQuantity[key.id] = product.quantity -= key.quantity;
          }
        });
      });
      const updatingProduct = await this.plintProductService.update(updatingQuantity)
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


  @Get()
  findAll() {
    return this.plintOrderService.findAll();
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plintOrderService.remove(+id);
  }
}
