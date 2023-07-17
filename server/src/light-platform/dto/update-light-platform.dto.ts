import { PartialType } from '@nestjs/mapped-types';
import { CreateLightPlatformDto } from './create-light-platform.dto';

export class UpdateLightPlatformDto extends PartialType(CreateLightPlatformDto) {}
