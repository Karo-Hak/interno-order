import { PartialType } from '@nestjs/mapped-types';
import { CreatePlintProductDto } from './create-plint-product.dto';

export class UpdatePlintProductDto extends PartialType(CreatePlintProductDto) {}
