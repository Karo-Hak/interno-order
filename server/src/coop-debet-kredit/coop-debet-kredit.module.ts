import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CoopDebetKredit, CoopDebetKreditSchema } from "./schema/coop-debet-kredit.schema";
import { CoopStretchBuyer, CoopStretchBuyerSchema } from "src/coop-stretch-buyer/schema/coop-stretch-buyer.schema";
import { CoopCeilingOrder, CoopCeilingOrderSchema } from "src/coop-ceiling-order/schema/coop-ceiling-order.schema";
import { CoopDebetKreditController } from "./coop-debet-kredit.controller";
import { CoopDebetKreditService } from "./coop-debet-kredit.service";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CoopDebetKredit.name, schema: CoopDebetKreditSchema },
            { name: CoopStretchBuyer.name, schema: CoopStretchBuyerSchema },
            { name: CoopCeilingOrder.name, schema: CoopCeilingOrderSchema },
        ]),
    ],
    controllers: [CoopDebetKreditController],
    providers: [CoopDebetKreditService],
    exports: [CoopDebetKreditService]
})

export class CoopDebetKreditModule { }