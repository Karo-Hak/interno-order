import { Module } from '@nestjs/common';
import { ProfilService } from './profil.service';
import { ProfilController } from './profil.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profil, ProfilSchema } from './schema/profil.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profil.name, schema: ProfilSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
    ProductModule
  ],
  controllers: [ProfilController],
  providers: [ProfilService],
  exports: [ProfilService]
})
export class ProfilModule { }
