import { Injectable, } from '@nestjs/common';
import { CreateUnytDto } from './dto/create-unyt.dto';
import { UpdateUnytDto } from './dto/update-unyt.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Unyt } from './schema/unyt.schema';
import { Model } from 'mongoose';


@Injectable()
export class UnytService {

  constructor(@InjectModel(Unyt.name) private unytModel: Model<Unyt>) { }

  create(createUnytDto: CreateUnytDto) {
    return 'This action adds a new unyt';
  }

  async findAll() {
    return await this.unytModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} unyt`;
  }

  update(id: number, updateUnytDto: UpdateUnytDto) {
    return `This action updates a #${id} unyt`;
  }

  remove(id: number) {
    return `This action removes a #${id} unyt`;
  }
}
