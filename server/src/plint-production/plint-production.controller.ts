import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { Response } from 'express';

import { PlintProductService } from 'src/plint-product/plint-product.service';
import { PlintProductionService } from './plint-production.service';


@Controller('plintProduction')
export class PlintProductionController {
  constructor(
    private readonly plintProductionService: PlintProductionService,
    private readonly plintProductService: PlintProductService

  ) {
  }

  @Post()
  async create(@Body() obj: any, @Res() res: Response) {
    try {
      let product
      if (obj.plintProduction.productId) {
        product = await this.plintProductService.findById(obj.plintProduction.productId);
      } else {
        return res.status(HttpStatus.CREATED).json({
          message: "created",
        })
      }
      
      const createdPlinthProduction = { plintProduction: obj.plintProduction, plint: product.id, user: obj.user.userId }
      const plintOrder = await this.plintProductionService.create(createdPlinthProduction);
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

  //   @Get('findNew')
  //   async findNew(@Res() res: Response) {
  //     try {
  //       const newOrders = await this.plintOrderService.findNewOrders();
  //       return res.status(HttpStatus.OK).json({ plint: newOrders });
  //     } catch (e) {
  //       return res.status(HttpStatus.OK).json({
  //         error: e.message
  //       })
  //     }
  //   }

  //   @Post('viewPlintOrdersList')
  //   async filterOrder(@Body() obj: any, @Res() res: Response) {
  //     try {
  //       const startDate = new Date(obj.dateFilter.startDate)
  //       const endDate = new Date(obj.dateFilter.endDate)
  //       const order = await this.plintOrderService.filterOrder(startDate, endDate)
  //       return res.status(HttpStatus.CREATED).json(order);
  //     } catch (e) {
  //       return res.status(HttpStatus.BAD_REQUEST).json({
  //         message: e.message
  //       });
  //     }
  //   }

  //   @Get('findPlintOrder/:id')
  //   async findOne(@Param('id') id: string, @Res() res: Response) {
  //     try {
  //       const order = await this.plintOrderService.findOne(id);
  //       return res.status(HttpStatus.OK).json({ order });
  //     } catch (e) {
  //       return res.status(HttpStatus.OK).json({
  //         error: e.message
  //       })
  //     }
  //   }

  //   @Put('updateStatus/:id')
  //   async updateStretchPayed(@Param('id') id: string, @Res() res: Response) {
  //     try {
  //       const result = await this.plintOrderService.updateStatus(id);
  //       const idArray = result.groupedPlintData.map((key: any) => key.id);
  //       const products = await this.plintProductService.findByIds(idArray);
  //       const updatingQuantity = {}
  //       result.groupedPlintData.forEach((key: any) => {
  //         products.forEach((product: any) => {
  //           if (key.id.toString() === product._id.toString()) {
  //             updatingQuantity[key.id] = product.quantity -= key.quantity;
  //           }
  //         });
  //       });
  //       const updatingProduct = await this.plintProductService.update(updatingQuantity)
  //       return res.status(HttpStatus.OK).json({
  //         message: 'Status updated successfully',
  //         result,

  //       });
  //     } catch (e) {
  //       return res.status(HttpStatus.BAD_REQUEST).json({
  //         error: e.message,
  //       });
  //     }
  //   }


  //   @Get()
  //   findAll() {
  //     return this.plintOrderService.findAll();
  //   }


  //   @Patch(':id')
  //   update(@Param('id') id: string, @Body() updatePlintOrderDto: UpdatePlintOrderDto) {
  //     return this.plintOrderService.update(+id, updatePlintOrderDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.plintOrderService.remove(+id);
  //   }
}
