import { Body, Controller, Delete, Get, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoopReturnService } from './coop-return.service';
import { CreateCoopReturnDto } from './dto/create-coop-return.dto';

@Controller('coop-return')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class CoopReturnController {
  constructor(private readonly service: CoopReturnService) {}

  @Post() create(@Body() dto: CreateCoopReturnDto) { return this.service.create(dto); }

  @Get(':id') getOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Get() list(@Query('buyerId') buyerId?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.service.list({ buyerId, from, to });
  }
  
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
