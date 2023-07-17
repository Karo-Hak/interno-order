import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, HttpStatus, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req, @Res() res: Response) {
    try {
      await this.userService.findAndUpdatToken(req.user.userId, req)
      req.user = null
      res.cookie("access_token", '')
      return res.status(HttpStatus.OK).json({
        message: 'Logged out successfully',
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  async findOneLogin(@Request() req) {
    
      return await { user: req.user };
    
    
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response, @Request() req) {
    try {
      const data = await this.userService.create(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        message: "create user",
        data
      })
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get('allUser')
  async findAll(@Res() res: Response) {
    try {
      const user = await this.userService.findAll();
      return res.status(HttpStatus.OK).json(user);
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: e.message
      })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
