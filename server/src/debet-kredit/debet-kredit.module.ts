import { Module } from "@nestjs/common";
import { DebetKredit, DebetKreditSchema } from "./schema/debet-kredit.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { DebetKreditController } from "./debet-kredit.controller";
import { DebetKreditService } from "./debet-kredit.service";
import { StretchBuyer, StretchBuyerSchema } from "src/stretch-buyer/schema/stretch-buyer.schema";
import { StretchCeilingOrder, StretchCeilingOrderSchema } from "src/stretch-ceiling-order/schema/stretch-ceiling-order.schema";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: DebetKredit.name, schema: DebetKreditSchema },
            { name: StretchBuyer.name, schema: StretchBuyerSchema },
            { name: StretchCeilingOrder.name, schema: StretchCeilingOrderSchema },
        ]),
        
    ],
    controllers: [DebetKreditController],
    providers: [DebetKreditService],
    exports: [DebetKreditService]
})

export class DebetKreditModule { }