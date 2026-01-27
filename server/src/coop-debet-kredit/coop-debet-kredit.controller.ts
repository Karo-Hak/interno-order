import { Body, Controller, Delete, HttpStatus, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { CoopDebetKreditService } from "./coop-debet-kredit.service";
import { AuthGuard } from "@nestjs/passport";



@Controller('coop-debet-kredit')
export class CoopDebetKreditController {
    constructor(
        private readonly coopDebetKreditService: CoopDebetKreditService,
    ) { }

    @Delete(':id')
    async removeById(@Param('id') id: string) {
        return this.coopDebetKreditService.removePaymentByDkId(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("pay")
    async create(@Body() data: any, @Req() req: any, @Res() res: Response) {
        try {
            const sum = Number(data?.sum);

            const userId = req.user?._id ?? req.user?.id ?? req.user?.userId;
            if (!userId) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized: user not found" });
            }

            const payed = await this.coopDebetKreditService.createPayment(
                data?.id,
                data?.buyerId,
                sum,
                { userId }
            );

            return res.status(HttpStatus.OK).json({ message: "ok", payed });
        } catch (e: any) {
            console.error("An error occurred:", e);
            return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
        }
    }



    @Post("payReturn")
    async return(@Body() data: any, @Res() res: Response) {
        try {
            const payed = await this.coopDebetKreditService.createReturnPayment(data.id, data.sum)
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