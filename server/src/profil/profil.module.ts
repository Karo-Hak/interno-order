import { Module } from '@nestjs/common';
import { ProfilService } from './profil.service';
import { ProfilController } from './profil.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profil, ProfilSchema } from './schema/profil.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profil.name, schema: ProfilSchema }])
  ],
  controllers: [ProfilController],
  providers: [ProfilService],
  exports: [ProfilService]
})
export class ProfilModule { }
