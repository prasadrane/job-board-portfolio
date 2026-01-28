import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@jobboard/shared';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
