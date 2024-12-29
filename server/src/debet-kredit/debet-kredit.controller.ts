import { Body, Controller, Get, HttpStatus, Param, Post, Res } from "@nestjs/common";
import { DebetKreditService } from "./debet-kredit.service";
import { Response } from 'express';



@Controller('debet-kredit')
export class DebetKreditController {
    constructor(
        private readonly debetKreditService: DebetKreditService,
    ) { }

    @Post("pay")
    async create(@Body() data: any, @Res() res: Response) {
        try {
            const payed = await this.debetKreditService.creatPayment(data.params.id, data.sum)
            return res.status(HttpStatus.OK).json({
                message: "ok",
                payed
            });
        } catch (e) {
            console.error('An error occurred:', e);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: e.message,
            });
        }
    }

    @Post('view')
    async findByDate(@Body() date: any, @Res() res: Response) {
        try {
            const startDate = new Date(date.dateFilter.startDate)
            const endDate = new Date(date.dateFilter.endDate)

            const debetKreditByBuyers = await this.debetKreditService.findAllByBuyer();
            const debetKreditDataPlain: any = debetKreditByBuyers.map(item => item.toObject());
            const debetKreditData = await this.debetKreditService.findByDate(startDate, endDate);

            if (debetKreditDataPlain && debetKreditDataPlain.length > 0) {
                for (const element of debetKreditDataPlain) {
                    let sumKredit = 0;
                    for (const item of element.debetKredit) {
                        if (item.type === "Գնում") {
                            sumKredit += item.amount;
                        } else {
                            sumKredit -= item.amount;
                        }
                    }
                    element.sumKredit = sumKredit;
                }
            }

            for (const element of debetKreditDataPlain) {
                element.debetKredit.splice(0, element.debetKredit.length)
            }
            for (const element of debetKreditDataPlain) {
                for (const item of debetKreditData) {
                    if (element._id.toString() === item.buyer.toString()) {
                        element.debetKredit.push(item);
                    }
                }
            }
            const data = debetKreditDataPlain.filter(element => element.debetKredit.length > 0);

            return res.status(HttpStatus.OK).json({
                message: "ok",
                data
            });
        } catch (e) {
            console.error('An error occurred:', e);
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: e.message,
            });
        }


    }

    @Get('findStretchOrder/:id')
    async findOne(@Param('id') id: string, @Res() res: Response) {
        console.log(id);
        
    }

}