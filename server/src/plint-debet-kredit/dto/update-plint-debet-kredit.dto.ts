import { PartialType } from "@nestjs/mapped-types";
import { CreatePlintDebetKreditDto } from "./create-plint-debet-kredit.dto";

export class UpdatePlintDebetKreditDto extends PartialType(CreatePlintDebetKreditDto) {}