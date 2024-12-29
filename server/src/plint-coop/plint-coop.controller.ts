import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, HttpStatus, Query, Req } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePlintCoopDto } from './dto/create-plint-coop.dto';
import { PlintCoopService } from './plint-coop.service';
import { UpdatePlintCoopDto } from './dto/update-plint-coop.dto';

@Controller('plint-coop')
export class PlintCoopController {
    constructor(private readonly plintCoopService: PlintCoopService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createPlintCoopDto: CreatePlintCoopDto, @Res() res: Response, @Request() req) {
        
        try {
            const data = await this.plintCoopService.create(createPlintCoopDto);
            return res.status(HttpStatus.CREATED).json({
                message: "create cooperate",
                data
            })
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                error: e.message
            })
        }
    }

    @Get()
    async findAll(@Request() req, @Res() res: Response) {
        try {
            const plintCoop = await this.plintCoopService.findAll();
            return res.status(HttpStatus.OK).json({plintCoop});
        } catch (e) {
            return res.status(HttpStatus.OK).json({
                error: e.message
            })
        }
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.plintCoopService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePlintCoopDto: UpdatePlintCoopDto) {
        return this.plintCoopService.update(+id, updatePlintCoopDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.plintCoopService.remove(+id);
    }
}
