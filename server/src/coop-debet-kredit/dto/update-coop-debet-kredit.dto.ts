import { PartialType } from "@nestjs/mapped-types";
import { CreateCoopDebetKreditDto } from "./create-coop-debet-kredit.dto";

export class UpdateCoopDebetKreditDto extends PartialType(CreateCoopDebetKreditDto) {}