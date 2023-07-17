import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UserSphereService } from './user-sphere.service';
import { CreateUserSphereDto } from './dto/create-user-sphere.dto';
import { UpdateUserSphereDto } from './dto/update-user-sphere.dto';
import { Response } from 'express';


@Controller('userSphere')
export class UserSphereController {
  constructor(private readonly userSphereService: UserSphereService) { }

  @Post()
  create(@Body() createUserSphereDto: CreateUserSphereDto) {
    return this.userSphereService.create(createUserSphereDto);
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      
      const userSphere = await this.userSphereService.findAll();
      return res.status(HttpStatus.OK).json(userSphere);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSphereService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSphereDto: UpdateUserSphereDto) {
    return this.userSphereService.update(+id, updateUserSphereDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSphereService.remove(+id);
  }
}
