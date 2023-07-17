import { Injectable } from '@nestjs/common';
import { CreateBardutyunDto } from './dto/create-bardutyun.dto';
import { UpdateBardutyunDto } from './dto/update-bardutyun.dto';

@Injectable()
export class BardutyunService {
  create(createBardutyunDto: CreateBardutyunDto) {
    return 'This action adds a new bardutyun';
  }

  findAll() {
    return `This action returns all bardutyun`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bardutyun`;
  }

  update(id: number, updateBardutyunDto: UpdateBardutyunDto) {
    return `This action updates a #${id} bardutyun`;
  }

  remove(id: number) {
    return `This action removes a #${id} bardutyun`;
  }
}
