import { Injectable } from '@nestjs/common';
import { CreateLightPlatformDto } from './dto/create-light-platform.dto';
import { UpdateLightPlatformDto } from './dto/update-light-platform.dto';

@Injectable()
export class LightPlatformService {
  create(createLightPlatformDto: CreateLightPlatformDto) {
    return 'This action adds a new lightPlatform';
  }

  findAll() {
    return `This action returns all lightPlatform`;
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
