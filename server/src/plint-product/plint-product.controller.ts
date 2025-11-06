import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlintProductService } from './plint-product.service';
import { CreatePlintProductDto } from './dto/create-plint-product.dto';
import { UpdatePlintProductDto } from './dto/update-plint-product.dto';

@Controller('plint-products')
export class PlintProductController {
  constructor(private readonly service: PlintProductService) { }

  @Post()
  create(@Body() dto: CreatePlintProductDto) {
    return this.service.create(dto);
  }

  /** UNIVERSAL UPDATE: PATCH /plint-products/:id  (любой апдейт по UpdatePlintProductDto) */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlintProductDto) {
    return this.service.update(id, dto);
  }

  /**
   * LEGACY UPDATE PRICE: POST /plint-products/updatePrice
   * Тело: { _id: string, retailPriceAMD?: number, wholesalePriceAMD?: number }
   * Использует тот же UpdatePlintProductDto, но обновляет только цены.
   */
  @Post('updatePrice')
  updatePricesLegacy(@Body() body: UpdatePlintProductDto & { _id: string }) {
    const { _id, ...dto } = body;
    return this.service.updatePrices(_id, dto);
  }

  @Get('allPlint')
  allPlint(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    return this.service.allPlint({
      q,
      limit: limit ? Number(limit) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get()
  findAll(@Query('q') q?: string) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/adjust-stock')
  adjust(@Param('id') id: string, @Body() body: { delta: number }) {
    return this.service.adjustStock(id, body?.delta);
  }
}
