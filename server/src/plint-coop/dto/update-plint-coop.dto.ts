import { PartialType } from '@nestjs/mapped-types';
import { CreatePlintCoopDto } from './create-plint-coop.dto';

export class UpdatePlintCoopDto extends PartialType(CreatePlintCoopDto) {}
