import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlintDebetKreditController } from "./plint-debet-kredit.controller";
import { PlintDebetKreditService } from "./plint-debet-kredit.service";
import { PlintRetailOrder, PlintRetailOrderSchema } from "src/plint-order/schema/plint-retail-order.schema";
import { PlintBuyer, PlintBuyerSchema } from "src/plintBuyer/schema/plint-buyer.schema";
import { PlintDebetKredit, PlintDebetKreditSchema } from "./schema/plint-debet-kredit.schema";
import { PlintWholesaleOrder, PlintWholesaleOrderSchema } from "src/plint-wholesale-order/schema/plint-wholesale-order.schema";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PlintDebetKredit.name, schema: PlintDebetKreditSchema },
            { name: PlintBuyer.name, schema: PlintBuyerSchema },
            { name: PlintRetailOrder.name, schema: PlintRetailOrderSchema },
            { name: PlintWholesaleOrder.name, schema: PlintWholesaleOrderSchema },
        ]),
    ],
    controllers: [PlintDebetKreditController],
    providers: [PlintDebetKreditService],
    exports: [PlintDebetKreditService]
})

export class PlintDebetKreditModule { }