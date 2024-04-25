import { PartialType } from "@nestjs/mapped-types";
import { CreateDebetKreditDto } from "./create-debet-kredit.dto";

export class UpdateDebetKreditDto extends PartialType(CreateDebetKreditDto) {}