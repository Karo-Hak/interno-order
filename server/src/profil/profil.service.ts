import { Injectable } from '@nestjs/common';
import { CreateProfilDto } from './dto/create-profil.dto';
import { UpdateProfilDto } from './dto/update-profil.dto';

@Injectable()
export class ProfilService {
  create(createProfilDto: CreateProfilDto) {
    return 'This action adds a new profil';
  }

  findAll() {
    return `This action returns all profil`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profil`;
  }

  update(id: number, updateProfilDto: UpdateProfilDto) {
    return `This action updates a #${id} profil`;
  }

  remove(id: number) {
    return `This action removes a #${id} profil`;
  }
}
