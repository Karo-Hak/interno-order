import { Body, Controller, Delete, HttpStatus, Param, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { CoopDebetKreditService } from "./coop-debet-kredit.service";



@Controller('coop-debet-kredit')
export class CoopDebetKreditController {
    constructor(
        private readonly coopDebetKreditService: CoopDebetKreditService,
    ) { }

    @Delete(':id')
    async removeById(@Param('id') id: string) {
        return this.coopDebetKreditService.removePaymentByDkId(id);
    }

    @Post('delete-by-date-sum')
    async deleteByDateSum(@Body() body: { buyerId: string; date: string; sum: number }) {
        return this.coopDebetKreditService.removePaymentByDateSum(body);
    }

    @Post("pay")
    async create(@Body() data: any, @Res() res: Response) {
        try {
            const payed = await this.coopDebetKreditService.createPayment(data.id, data.sum)
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

    


}