import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { PlintDebetKreditService } from "./plint-debet-kredit.service";




@Controller('plint-debet-kredit')
export class PlintDebetKreditController {
    constructor(
        private readonly plintDebetKreditService: PlintDebetKreditService,
    ) { }

    @Post("pay")
    async create(@Body() data: any, @Res() res: Response) {
        try {
            const payed = await this.plintDebetKreditService.creatPayment(data.params.id, data.sum)
            return  res.status(HttpStatus.OK).json({
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

            const debetKreditByBuyers = await this.plintDebetKreditService.findAllByBuyer();
            const debetKreditDataPlain: any = debetKreditByBuyers.map(item => item.toObject());
            const debetKreditData = await this.plintDebetKreditService.findByDate(startDate, endDate);

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

}