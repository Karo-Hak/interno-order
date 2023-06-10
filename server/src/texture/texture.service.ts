import { Injectable } from '@nestjs/common';
import { CreateTextureDto } from './dto/create-texture.dto';
import { UpdateTextureDto } from './dto/update-texture.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Texture } from './schema/texture.schema';
import { Model } from 'mongoose';

@Injectable()
export class TextureService {
  constructor(@InjectModel(Texture.name) private textureModel: Model<Texture>) { }

  async create(createTextureDto: CreateTextureDto) {
    const createdTexture = new this.textureModel(createTextureDto);
    return createdTexture.save();
  }

  async findAll() {
    return await this.textureModel.find()
  }

  async findOne(id: string) {
    return await this.textureModel.findById(id)
  }

  update(id: number, updateTextureDto: UpdateTextureDto) {
    return `This action updates a #${id} texture`;
  }

  remove(id: number) {
    return `This action removes a #${id} texture`;
  }
}
