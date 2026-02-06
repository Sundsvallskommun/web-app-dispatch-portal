export interface Permissions {
  canSendSMS: boolean;
  canSendLetter: boolean;
  canSendRegisteredLetter: boolean;
}
export interface User {
  id: number;
  name: string;
  givenName: string;
  surname: string;
  guid: string;
  email: string;
  username: string;
  permissions: Permissions;
  orgTree?: string;
}
