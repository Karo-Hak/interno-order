import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { PlintDebetKreditService } from "./plint-debet-kredit.service";




@Controller('plint-debet-kredit')
export class PlintDebetKreditController {
    constructor(
        private readonly plintDebetKreditService: PlintDebetKreditService,
    ) { }


}