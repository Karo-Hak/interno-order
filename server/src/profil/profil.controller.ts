import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { ProfilService } from './profil.service';
import { CreateProfilDto } from './dto/create-profil.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';
import { Response } from 'express';

@Controller('stretchProfil')
export class ProfilController {
  constructor(private readonly profilService: ProfilService) { }

  @Post() /// Price add
  async create(@Body() createProfilDto: CreateProfilDto, @Res() res: Response) {
    try {
      return await this.profilService.create(createProfilDto);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const stretchProfil = await this.profilService.findAll()
      return res.status(HttpStatus.OK).json({
        messege: "ok",
        stretchProfil
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfilDto: UpdateProfilDto) {
    return this.profilService.update(+id, updateProfilDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilService.remove(+id);
  }
}
