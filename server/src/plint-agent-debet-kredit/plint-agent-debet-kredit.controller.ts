import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { PlintAgentDebetKreditService } from "./plint-agent-debet-kredit.service";




@Controller('plint-agent-debet-kredit')
export class PlintAgentDebetKreditController {
    constructor(
        private readonly plintAgentDebetKreditService: PlintAgentDebetKreditService,
    ) { }


}