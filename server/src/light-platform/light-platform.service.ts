import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLightPlatformDto } from './dto/create-light-platform.dto';
import { UpdateLightPlatformDto } from './dto/update-light-platform.dto';
import { LightPlatform } from './schema/light-platform.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LightPlatformService {
  constructor(@InjectModel(LightPlatform.name) private lightPlatformModel: Model<LightPlatform>) { }

  async create(createLightPlatformDto: CreateLightPlatformDto) {
    const existingLightPlatform = await this.lightPlatformModel.findOne({ name: createLightPlatformDto.name });
    if (existingLightPlatform) {
      throw new NotFoundException('Bardutyun already exists');
    }
    const lightPlatform = new this.lightPlatformModel(createLightPlatformDto);
    return lightPlatform.save();
  }

  async findAll() {
    return await this.lightPlatformModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} lightPlatform`;
  }

  update(id: number, updateLightPlatformDto: UpdateLightPlatformDto) {
    return `This action updates a #${id} lightPlatform`;
  }

  remove(id: number) {
    return `This action removes a #${id} lightPlatform`;
  }
}
