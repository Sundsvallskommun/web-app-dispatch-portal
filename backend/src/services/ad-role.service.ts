import { ADMIN_GROUP } from '@/config';
import { InternalRoleEnum } from '@/interfaces/users.interface';

export type RoleADMapping = {
  [key: string]: InternalRoleEnum;
};

let mapping: RoleADMapping = {};
mapping[ADMIN_GROUP.toLocaleLowerCase()] = InternalRoleEnum.Admin;

export const roleADMapping: RoleADMapping = mapping;
