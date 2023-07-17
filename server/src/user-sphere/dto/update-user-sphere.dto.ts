import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSphereDto } from './create-user-sphere.dto';

export class UpdateUserSphereDto extends PartialType(CreateUserSphereDto) {}
