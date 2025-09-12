import { PartialType } from '@nestjs/mapped-types';
import { CreatePlintAgentDto } from './create-plint-ahent.dto';

export class UpdatePlintAgentDto extends PartialType(CreatePlintAgentDto) {}
