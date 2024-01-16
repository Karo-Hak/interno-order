import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLightRingDto } from './dto/create-light-ring.dto';
import { UpdateLightRingDto } from './dto/update-light-ring.dto';
import { Model } from 'mongoose';
import { LightRing } from './schema/light-ring.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LightRingService {
  constructor(@InjectModel(LightRing.name) private lightRingModel: Model<LightRing>) { }

 async create(createLightRingDto: CreateLightRingDto) {
    const existingLightRing = await this.lightRingModel.findOne({ name: createLightRingDto.name });
    if (existingLightRing) {
      throw new NotFoundException('Bardutyun already exists');
    }
    const LightRing = new this.lightRingModel(createLightRingDto);
    return LightRing.save();
  }

 async findAll() {
    return await this.lightRingModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} lightRing`;
  }

  update(id: number, updateLightRingDto: UpdateLightRingDto) {
    return `This action updates a #${id} lightRing`;
  }

  remove(id: number) {
    return `This action removes a #${id} lightRing`;
  }
}
