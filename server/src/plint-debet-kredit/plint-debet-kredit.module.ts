import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {  PlintDebetKreditController } from "./plint-debet-kredit.controller";
import {  PlintDebetKreditService } from "./plint-debet-kredit.service";
import { PlintOrder, PlintOrderSchema } from "src/plint-order/schema/plint-order.schema";
import { PlintBuyer, PlintBuyerSchema } from "src/plintBuyer/schema/plint-buyer.schema";
import { PlintDebetKredit, PlintDebetKreditSchema } from "./schema/plint-debet-kredit.schema";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PlintDebetKredit.name, schema: PlintDebetKreditSchema },
            { name: PlintBuyer.name, schema: PlintBuyerSchema },
            { name: PlintOrder.name, schema: PlintOrderSchema },
        ]),
    ],
    controllers: [PlintDebetKreditController],
    providers: [PlintDebetKreditService],
    exports: [PlintDebetKreditService]
})

export class PlintDebetKreditModule { }