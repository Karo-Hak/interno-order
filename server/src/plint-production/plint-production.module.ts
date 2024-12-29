import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';
import { PlintProduct, PlintProductSchema } from 'src/plint-product/schema/plint-product.schema';
import { PlintProductModule } from 'src/plint-product/plint-product.module';
import { PlintProduction, PlintProductionSchema } from './schema/plint-production.schema';
import { PlintProductionController } from './plint-production.controller';
import { PlintProductionService } from './plint-production.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlintProduction.name, schema: PlintProductionSchema },
      { name: User.name, schema: UserSchema },
      {name: PlintProduct.name, schema: PlintProductSchema }
    ]),
    UserModule,
    PlintProductModule

  ],
  controllers: [PlintProductionController],
  providers: [PlintProductionService],
  exports:[PlintProductionService]
})
export class PlintProductionModule {}
