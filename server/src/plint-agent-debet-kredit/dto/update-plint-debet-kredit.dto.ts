import { PartialType } from "@nestjs/mapped-types";
import { CreatePlintAgentDebetKreditDto } from "./create-plint-agent-debet-kredit.dto";

export class UpdatePlintAgentDebetKreditDto extends PartialType(CreatePlintAgentDebetKreditDto) {}