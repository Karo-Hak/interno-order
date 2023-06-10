import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) { }

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const user = await this.userService.findOneLogin(username);
      if (user && user.password === pass) {
        const us = new LoginUserDto(user);
        return us;
      }
      return null;
    } catch (e) {
      return { message: e.message }

    }
  }

  async login(user: any) {
    try {
      const payload = {
        username: user.username,
        sub: user._id,
        role: user.role,
        name: user.name,
        surname: user.surname
      };
      const access_token = this.jwtService.sign(payload)
      await this.userService.findAndUpdat(user._id, access_token)
      return {
        access_token,
        role: user.role,
        username: user.username,
        name: user.name,
        surname: user.surname
      };
    } catch (e) {
      return { message: e.message }
    }
  }




}