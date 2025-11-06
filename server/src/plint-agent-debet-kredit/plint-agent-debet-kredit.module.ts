import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlintAgent, PlintAgentSchema } from "src/plint-agent/schema/plint-agent.schema";
import { PlintBuyer, PlintBuyerSchema } from "src/plintBuyer/schema/plint-buyer.schema";
import { PlintAgentDebetKreditController } from "./plint-agent-debet-kredit.controller";
import { PlintAgentDebetKreditService } from "./plint-agent-debet-kredit.service";
import { PlintAgentDebetKredit, PlintAgentDebetKreditSchema } from "./schema/plint-agent-debet-kredit.schema";
import { PlintWholesaleOrder, PlintWholesaleOrderSchema } from "src/plint-wholesale-order/schema/plint-wholesale-order.schema";



@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PlintAgentDebetKredit.name, schema: PlintAgentDebetKreditSchema },
            { name: PlintBuyer.name, schema: PlintBuyerSchema },
            { name: PlintAgent.name, schema: PlintAgentSchema },
            { name: PlintWholesaleOrder.name, schema: PlintWholesaleOrderSchema },
        ]),
    ],
    controllers: [PlintAgentDebetKreditController],
    providers: [PlintAgentDebetKreditService],
    exports: [PlintAgentDebetKreditService]
})

export class PlintAgentDebetKreditModule { }