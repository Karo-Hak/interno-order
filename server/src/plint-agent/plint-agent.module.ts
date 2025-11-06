import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintAgent, PlintAgentSchema } from './schema/plint-agent.schema';
import { PlintAgentService } from './plint-agent.service';
import { PlintAgentController } from './plint-agent.controller';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PlintAgent.name, schema: PlintAgentSchema },
        ]),
    ],
    controllers: [PlintAgentController],
    providers: [PlintAgentService],
    exports: [PlintAgentService]
})
export class PlintAgentModule { }
