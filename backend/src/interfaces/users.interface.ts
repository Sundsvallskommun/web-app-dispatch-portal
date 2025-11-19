export interface User {
  id: number;
  name: string;
  givenName: string;
  surname: string;
  email: string;
  password: string;
  username: string;
  groups: string;
  permissions: Permissions;
  roles?: InternalRoleEnum[];
  personId: string;
  orgTree?: string;
}
export interface Permissions {
  canSendSMS: boolean;
}

/** Internal roles */
export type InternalRole = 'admin' | 'sms';
export enum InternalRoleEnum {
  Admin = 'admin',
  SMS = 'sms',
}

export type InternalRoleMap = Map<InternalRole, Partial<Permissions>>;
