import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, HttpStatus, Query, Req } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePlintAgentDto } from './dto/update-plint-agent.dto';
import { CreatePlintAgentDto } from './dto/create-plint-ahent.dto';
import { PlintAgentService } from './plint-agent.service';


@Controller('plint-agent')
export class PlintAgentController {
    constructor(private readonly plintAgentService: PlintAgentService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createPlintAgentDto: CreatePlintAgentDto, @Res() res: Response, @Request() req) {
        
        try {
            const data = await this.plintAgentService.create(createPlintAgentDto);
            return res.status(HttpStatus.CREATED).json({
                message: "create agent",
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
            const plintAgent = await this.plintAgentService.findAll();
            return res.status(HttpStatus.OK).json({plintAgent});
        } catch (e) {
            return res.status(HttpStatus.OK).json({
                error: e.message
            })
        }
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.plintAgentService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePlintAgentDto: UpdatePlintAgentDto) {
        return this.plintAgentService.update(+id, updatePlintAgentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.plintAgentService.remove(+id);
    }
}
