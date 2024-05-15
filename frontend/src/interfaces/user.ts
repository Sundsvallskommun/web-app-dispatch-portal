export interface Permissions {
  canEditMaster: boolean;
  canEditHR: boolean;
  canEditEconomy: boolean;
  canEditEmployee: boolean;
  canEditResponsibility: boolean;
  canEditOrganization: boolean;
  canEditOrganizationStructure: boolean;
  canView: boolean;
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
