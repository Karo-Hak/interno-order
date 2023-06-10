import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/role/role';

export const HasRoles = (...roles: Role[]) => SetMetadata('role', roles);