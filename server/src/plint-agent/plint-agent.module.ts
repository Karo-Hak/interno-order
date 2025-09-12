import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlintAgent, PlintAgentSchema } from './schema/plint-agent.schema';
import { PlintAgentController } from './plint-agent.controller';
import { PlintAgentService } from './plint-agent.service';


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
