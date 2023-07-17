import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStretchTextureDto } from './dto/create-stretch-texture.dto';
import { UpdateStretchTextureDto } from './dto/update-stretch-texture.dto';
import { InjectModel } from '@nestjs/mongoose';
import { StretchTexture } from './schema/stretch-texture.schema';
import { Model } from 'mongoose';
import { log } from 'util';

@Injectable()
export class StretchTextureService {
  constructor(@InjectModel(StretchTexture.name) private stretchTextureModel: Model<StretchTexture>) { }

  async create(createStretchTextureDto: CreateStretchTextureDto) {
    const existingStretchTexture = await this.stretchTextureModel.findOne({ name: createStretchTextureDto.name });
    if (existingStretchTexture) {
      throw new NotFoundException('texture already exists');
    }
    const stretchTexture = new this.stretchTextureModel(createStretchTextureDto);
    return stretchTexture.save();
  }

  async findAll() {
    return await this.stretchTextureModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} stretchTexture`;
  }

  update(id: number, updateStretchTextureDto: UpdateStretchTextureDto) {
    return `This action updates a #${id} stretchTexture`;
  }

  remove(id: number) {
    return `This action removes a #${id} stretchTexture`;
  }
}
