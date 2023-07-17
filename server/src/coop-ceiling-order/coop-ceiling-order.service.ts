import { Injectable } from '@nestjs/common';
import { CreateCoopCeilingOrderDto } from './dto/create-coop-ceiling-order.dto';
import { UpdateCoopCeilingOrderDto } from './dto/update-coop-ceiling-order.dto';

@Injectable()
export class CoopCeilingOrderService {
  create(createCoopCeilingOrderDto: CreateCoopCeilingOrderDto) {
    return 'This action adds a new coopCeilingOrder';
  }

  findAll() {
    return `This action returns all coopCeilingOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coopCeilingOrder`;
  }

  update(id: number, updateCoopCeilingOrderDto: UpdateCoopCeilingOrderDto) {
    return `This action updates a #${id} coopCeilingOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} coopCeilingOrder`;
  }
}
