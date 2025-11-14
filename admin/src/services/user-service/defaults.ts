import { AdminUser, AdminUserApiResponse } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const emptyUser: AdminUser = {
  name: '',
  username: '',
  givenName: '',
  surname: '',
};

export const emptyUserResponse: AdminUserApiResponse = {
  data: emptyUser,
  message: 'none',
};
