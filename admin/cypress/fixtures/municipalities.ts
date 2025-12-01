import {
  MunicipalitiesApiResponse,
  MunicipalityApiResponse,
  MunicipalityExtended,
} from '@data-contracts/backend/data-contracts';
import { logotype1, logotype2, logotype3 } from './logotypes';

export const municipality1: MunicipalityExtended = {
  id: 1,
  municipalityId: 100,
  name: 'Kommun 1',
  logotypeId: logotype1.id,
  logotype: logotype1,
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};
export const municipality2: MunicipalityExtended = {
  id: 2,
  municipalityId: 200,
  name: 'Kommun 2',
  logotypeId: logotype2.id,
  logotype: logotype2,
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};
export const municipality3: MunicipalityExtended = {
  id: 3,
  municipalityId: 300,
  name: 'Kommun 3',
  logotypeId: logotype3.id,
  logotype: logotype3,
  createdAt: '2025-09-10T14:24:46.527Z',
  updatedAt: '2025-09-20T14:24:46.527Z',
};

export const municipalities: MunicipalitiesApiResponse = {
  message: 'success',
  data: [municipality1, municipality2],
};
export const municipalitiesWithNew: MunicipalitiesApiResponse = {
  message: 'success',
  data: [municipality1, municipality2, municipality3],
};
export const municipalitiy: MunicipalityApiResponse = {
  message: 'success',
  data: municipality1,
};
export const newMunicipalitiy: MunicipalityApiResponse = {
  message: 'success',
  data: municipality3,
};
