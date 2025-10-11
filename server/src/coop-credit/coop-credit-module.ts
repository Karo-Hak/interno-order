import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CoopCredit, CoopCreditSchema } from "./schema/coop-credit.schema";
import { CoopStretchBuyer, CoopStretchBuyerSchema } from "src/coop-stretch-buyer/schema/coop-stretch-buyer.schema";
import { CoopCeilingOrder, CoopCeilingOrderSchema } from "src/coop-ceiling-order/schema/coop-ceiling-order.schema";
import { CoopCreditController } from "./coop-credit-controller";
import { CoopCreditService } from "./coop-credit-service";



@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CoopCredit.name, schema: CoopCreditSchema },
            { name: CoopStretchBuyer.name, schema: CoopStretchBuyerSchema },
            { name: CoopCeilingOrder.name, schema: CoopCeilingOrderSchema },
        ]),
    ],
    controllers: [CoopCreditController],
    providers: [CoopCreditService],
    exports: [CoopCreditService]
})

export class CoopCreditModule { }

