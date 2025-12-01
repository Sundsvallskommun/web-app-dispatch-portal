import { AdminUserApiResponse } from '../../src/data-contracts/backend/data-contracts';

export const me: AdminUserApiResponse = {
  data: {
    username: 'per00per',
    name: 'Person Personsson',
    givenName: 'Person',
    surname: 'Personsson',
  },
  message: 'success',
};

export default me;
