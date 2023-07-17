import { PartialType } from '@nestjs/mapped-types';
import { CreateStretchTextureDto } from './create-stretch-texture.dto';

export class UpdateStretchTextureDto extends PartialType(CreateStretchTextureDto) {}
