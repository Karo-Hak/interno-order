import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PlintAgentService } from './plint-agent.service';
import { CreatePlintAgentDto } from './dto/create-plint-agent.dto';
import { QueryPlintAgentDto } from './dto/query-plint-agent.dto';
import { UpdatePlintAgentDto } from './dto/update-plint-agent.dto';
import { LinkAgentDebetKreditDto, LinkOrderDto } from './dto/link.dto';
import { AdjustBalanceDto, SetBalanceDto } from './dto/balance.dto';


@Controller('plint-agent')
export class PlintAgentController {
  constructor(private readonly service: PlintAgentService) {}

  @Post()
  create(@Body() dto: CreatePlintAgentDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() q: QueryPlintAgentDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlintAgentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // Связи
  @Post(':id/link-order')
  linkOrder(@Param('id') id: string, @Body() dto: LinkOrderDto) {
    return this.service.linkOrder(id, dto.orderId);
  }

  @Post(':id/link-dk')
  linkDK(@Param('id') id: string, @Body() dto: LinkAgentDebetKreditDto) {
    return this.service.linkDebetKredit(id, dto.dkId);
  }

  @Post(':id/unlink-order')
  unlinkOrder(@Param('id') id: string, @Body() dto: LinkOrderDto) {
    return this.service.unlinkOrder(id, dto.orderId);
  }

  @Post(':id/unlink-dk')
  unlinkDK(@Param('id') id: string, @Body() dto: LinkAgentDebetKreditDto) {
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
