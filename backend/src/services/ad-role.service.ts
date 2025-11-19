import { ADMIN_GROUP, SMS_GROUP } from '@/config';
import { InternalRoleEnum } from '@/interfaces/users.interface';

export type RoleADMapping = {
  [key: string]: InternalRoleEnum;
};

let mapping: RoleADMapping = {};
mapping[ADMIN_GROUP.toLocaleLowerCase()] = InternalRoleEnum.Admin;
mapping[SMS_GROUP.toLocaleLowerCase()] = InternalRoleEnum.SMS;

export const roleADMapping: RoleADMapping = mapping;
