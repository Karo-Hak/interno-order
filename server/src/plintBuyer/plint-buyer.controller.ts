import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlintBuyerService } from './plint-buyer.service';
import { CreatePlintBuyerDto } from './dto/create-plint-buyer.dto';
import { UpdatePlintBuyerDto } from './dto/update-plint-buyer.dto';
import { QueryPlintBuyerDto } from './dto/query-plint-buyer.dto';
import { LinkDebetKreditDto, LinkOrderDto } from './dto/link.dto';
import { AdjustBalanceDto, SetBalanceDto } from './dto/balance.dto';

@Controller('plint-buyer')
export class PlintBuyerController {
  constructor(private readonly service: PlintBuyerService) { }

  @Post()
  create(@Body() dto: CreatePlintBuyerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() q: QueryPlintBuyerDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlintBuyerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post('delete-by-date-sum')
  async deleteByDateSum(@Body() body: { buyerId: string; date: string; sum: number }) {
    return this.service.removePaymentByDateSum(body);
  }


  @Post(':id/link-dk')
  linkDK(@Param('id') id: string, @Body() dto: LinkDebetKreditDto) {
    return this.service.linkDebetKredit(id, dto.dkId);
  }


  @Post(':id/unlink-dk')
  unlinkDK(@Param('id') id: string, @Body() dto: LinkDebetKreditDto) {
    return this.service.unlinkDebetKredit(id, dto.dkId);
  }
  @Post(':id/adjust-balance')
  adjustBalance(@Param('id') id: string, @Body() dto: AdjustBalanceDto) {
    return this.service.adjustBalance(id, dto.deltaAMD);
  }

  @Post(':id/set-balance')
  setBalance(@Param('id') id: string, @Body() dto: SetBalanceDto) {
    return this.service.setBalance(id, dto.valueAMD);
  }


}
