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
  personId: string;
  orgTree?: string;
}
export interface Permissions {
  canEdit: boolean;
  canView: boolean;
}

export type Roles = 'sg_mea_prh_handlaggare' | 'sg_mea_kc_handlaggare' | 'sg_mea_prh_utvecklare' | 'sg_mea_prh_guest';

export type RolesMap = Map<Roles, Partial<Permissions>>;
