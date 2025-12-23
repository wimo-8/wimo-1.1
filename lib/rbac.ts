import { Role } from '@prisma/client';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['manage_catalog', 'manage_orders', 'manage_payments'],
};

export function hasPermission(userRoles: Role[], permission: string) {
  return userRoles.some((role) => ROLE_PERMISSIONS[role.name]?.includes('*') || ROLE_PERMISSIONS[role.name]?.includes(permission));
}
