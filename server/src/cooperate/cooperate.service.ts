import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCooperateDto } from './dto/create-cooperate.dto';
import { UpdateCooperateDto } from './dto/update-cooperate.dto';
import { Cooperate } from './schema/cooperate.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CooperationSphere } from 'src/cooperation-sphere/shema/cooperation-sphere.schema';

@Injectable()
export class CooperateService {
  constructor(
    @InjectModel(Cooperate.name) private cooperateModel: Model<Cooperate>,
    @InjectModel('CooperationSphere') private cooperationSphereModel: Model<CooperationSphere>,

  ) { }


  async create(createCooperateDto: CreateCooperateDto) {
    const { phone } = createCooperateDto;
    const cooperationSphere = await this.cooperationSphereModel.findById(createCooperateDto.cooperationSphere);
    const oldCooperate = await this.cooperateModel.findOne({ phone });
    if (oldCooperate) {
      throw new NotFoundException('cooperate already exists');
    }
    const createdCooperate = new this.cooperateModel(createCooperateDto);
    if (cooperationSphere) {
      await this.cooperationSphereModel.findByIdAndUpdate(createCooperateDto.cooperationSphere, { cooperate: [...cooperationSphere.cooperate, createdCooperate.id] })
    }
    return createdCooperate.save();
  }


  async findAll() {
    return await this.cooperateModel.find().populate("cooperationSphere")
  }

  findOne(id: number) {
    return `This action returns a #${id} cooperate`;
  }

  update(id: number, updateCooperateDto: UpdateCooperateDto) {
    return `This action updates a #${id} cooperate`;
  }

  remove(id: number) {
    return `This action removes a #${id} cooperate`;
  }
}
