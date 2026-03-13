import { Controller, Patch, Param, Body, Post } from "@nestjs/common";
import { CoopCreditService } from "./coop-credit-service";

@Controller("coop-credit")
export class CoopCreditController {
  constructor(private readonly service: CoopCreditService) {}

   @Post()
  createRaw(@Body() body: any) {
    return this.service.createRaw(body);
  }
  @Patch(":id/payments")
  addPaymentRaw(@Param("id") id: string, @Body() body: any) {
    return this.service.addPaymentRaw(id, body);
  }

  @Patch(":id/buys")
  addBuyRaw(@Param("id") id: string, @Body() body: any) {
    return this.service.addBuyRaw(id, body);
  }

  @Patch(":id/recompute")
  recompute(@Param("id") id: string) {
    return this.service.recomputeBalance(id);
  }
}
