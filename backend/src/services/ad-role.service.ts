import { ADMIN_GROUP } from '@/config';
import { InternalRoleEnum } from '@/interfaces/users.interface';
import { parseConfiguredGroups } from '@/utils/normalizeGroup';

export type RoleADMapping = {
  [key: string]: InternalRoleEnum;
};

let mapping: RoleADMapping = {};

for (const group of parseConfiguredGroups(ADMIN_GROUP)) {
  mapping[group] = InternalRoleEnum.Admin;
}

export const roleADMapping: RoleADMapping = mapping;

