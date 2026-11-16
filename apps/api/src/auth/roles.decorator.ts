import { SetMetadata } from '@nestjs/common';
import { RoleSlug } from '@prisma/client';

export const ROLES_KEY = 'roles';

/** Décorateur d'autorisation : liste des rôles autorisés sur une route. */
export const Roles = (...roles: RoleSlug[]) => SetMetadata(ROLES_KEY, roles);
