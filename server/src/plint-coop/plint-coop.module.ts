import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintCoop, PlintCoopSchema } from './schema/plint-coop.schema';
import { PlintCoopController } from './plint-coop.controller';
import { PlintCoopService } from './plint-coop.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PlintCoop.name, schema: PlintCoopSchema },
        ]),
    ],
    controllers: [PlintCoopController],
    providers: [PlintCoopService],
    exports: [PlintCoopService]
})
export class PlintCoopModule { }
