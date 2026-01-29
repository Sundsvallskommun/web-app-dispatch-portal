export interface User {
  name: string;
  givenName: string;
  surname: string;
  email: string;
  username: string;
  groups: string[];
  permissions: Permissions;
  roles?: InternalRole[];
  personId: string;
  orgTree?: string;
}
export interface Permissions {
  canSendSMS: boolean;
  canSendLetter: boolean;
  canSendRegisteredLetter: boolean;
}

/** Internal roles */
export type InternalRole = 'admin' | 'sms';
export enum InternalRoleEnum {
  Admin = 'admin',
}

export type InternalRoleMap = Map<InternalRole, Partial<Permissions>>;
