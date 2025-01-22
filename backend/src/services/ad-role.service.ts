import { InternalRole } from '@/interfaces/users.interface';

export type RoleADMapping = {
  [key: string]: InternalRole;
};

let mapping: RoleADMapping = {};
mapping[process.env.SMS_GROUP.toLocaleLowerCase()] = 'sms';

export const roleADMapping: RoleADMapping = mapping;
