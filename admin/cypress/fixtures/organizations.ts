import {
  OrganizationApiResponse,
  OrganizationExtended,
  OrganizationsApiResponse,
} from '@data-contracts/backend/data-contracts';
import { logotype1, logotype2, logotype3 } from './logotypes';
import { municipality1, municipality2 } from './municipalities';

export const org1: OrganizationExtended = {
  id: 1,
  host: 'www.test.com',
  orgId: 20,
  name: 'Bolag 1',
  logotypeId: logotype1.id,
  logotype: logotype1,
  municipalityId: municipality1.municipalityId,
  municipality: municipality1,
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};
export const org2: OrganizationExtended = {
  id: 2,
  host: 'www.test.se',
  orgId: 21,
  name: 'Bolag 2',
  logotypeId: logotype2.id,
  logotype: logotype2,
  municipalityId: municipality2.municipalityId,
  municipality: municipality2,
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};
export const org3: OrganizationExtended = {
  id: 3,
  host: 'www.test.nu',
  orgId: 22,
  name: 'Bolag 3',
  logotypeId: logotype3.id,
  logotype: logotype3,
  municipalityId: municipality1.municipalityId,
  municipality: municipality1,
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};
export const org4: OrganizationExtended = {
  id: 4,
  host: 'mytest.this',
  orgId: 23,
  name: 'Bolag 4',
  logotypeId: logotype1.id,
  logotype: logotype1,
  municipalityId: municipality2.municipalityId,
  municipality: municipality2,
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};

export const organizations: OrganizationsApiResponse = {
  message: 'success',
  data: [org1, org2, org3],
};
export const organizationsWithNew: OrganizationsApiResponse = {
  message: 'success',
  data: [org1, org2, org3, org4],
};
export const organization: OrganizationApiResponse = {
  message: 'success',
  data: org1,
};
export const newOrganization: OrganizationApiResponse = {
  message: 'success',
  data: org4,
};
