import { describe, expect, it } from 'vitest';
import { hasPermission } from '@/lib/rbac';
import { Role } from '@prisma/client';

describe('rbac', () => {
  const superRole = [{ id: 1, name: 'SUPER_ADMIN', permissions: [], users: [] }] as Role[];
  const adminRole = [{ id: 2, name: 'ADMIN', permissions: [], users: [] }] as Role[];
  it('super admin sees all', () => {
    expect(hasPermission(superRole, 'anything')).toBe(true);
  });
  it('admin limited', () => {
    expect(hasPermission(adminRole, 'manage_catalog')).toBe(true);
    expect(hasPermission(adminRole, 'other')).toBe(false);
  });
});
