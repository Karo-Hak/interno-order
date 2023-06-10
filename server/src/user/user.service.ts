import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto) {
    const { username } = createUserDto;
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new NotFoundException('user already exists');
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    return await this.userModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneLogin(username: string) {
    const user = await this.userModel.findOne({ username: username });
    if (!user) {
      throw new UnauthorizedException('username not found');
    }
    return user;
  }

  async findAndUpdat(id: string, text: string) {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    if (!text) {
      throw new BadRequestException('access_token invalid');
    }
    await this.userModel.findByIdAndUpdate(id, { access_token: text })
    return "user update"
  }

  async findAndUpdatToken(id: string, req: Request) {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    await this.userModel.findByIdAndUpdate(id, { access_token: null })
    return "user update"
  }

}
