import { Injectable } from '@nestjs/common';
import { CreateLightRingDto } from './dto/create-light-ring.dto';
import { UpdateLightRingDto } from './dto/update-light-ring.dto';

@Injectable()
export class LightRingService {
  create(createLightRingDto: CreateLightRingDto) {
    return 'This action adds a new lightRing';
  }

  findAll() {
    return `This action returns all lightRing`;
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
