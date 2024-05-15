import { User, Permissions } from '@interfaces/user';
import { ApiResponse } from '@services/api-service';

export const defaultPermissions: Permissions = {
  canEditMaster: false,
  canEditHR: false,
  canEditEconomy: false,
  canEditEmployee: false,
  canEditResponsibility: false,
  canEditOrganization: false,
  canEditOrganizationStructure: false,
  canView: false,
};

export const emptyUser: User = {
  id: 0,
  guid: '',
  email: '',
  name: '',
  username: '',
  permissions: defaultPermissions,
  givenName: '',
  surname: '',
};

export const emptyUserResponse: ApiResponse<User> = {
  data: emptyUser,
  message: 'none',
};
