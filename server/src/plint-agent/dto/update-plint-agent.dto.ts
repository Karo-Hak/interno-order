import { PartialType } from '@nestjs/mapped-types';
import { CreatePlintAgentDto } from './create-plint-agent.dto';

export class UpdatePlintAgentDto extends PartialType(CreatePlintAgentDto) {}
