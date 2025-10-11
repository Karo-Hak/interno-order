import { PartialType } from "@nestjs/mapped-types";
import { CreateCoopCreditDto } from "./create-coop-credit.dto";

export class UpdateCoopDebetKreditDto extends PartialType(CreateCoopCreditDto) {}