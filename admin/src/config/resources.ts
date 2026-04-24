import { Admin } from '@data-contracts/backend/Admin';
import {
  CreateHostDto,
  CreateIdpDto,
  Host,
  IDP,
  UpdateHostDto,
  UpdateIdpDto,
} from '@data-contracts/backend/data-contracts';

import { Resource } from '@interfaces/resource';

const apiService = new Admin({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PATH}`,
  withCredentials: true,
});

const idps: Resource<IDP, CreateIdpDto, UpdateIdpDto> = {
  name: 'idps',
  getOne: apiService.adminIdpControllerGetOne,
  getMany: apiService.adminIdpControllerGetAll,
  create: apiService.adminIdpControllerCreate,
  update: apiService.adminIdpControllerUpdate,
  remove: apiService.adminIdpControllerRemove,

  defaultValues: {
    name: '',
    entryPoint: '',
    idpCert: '',
  },
  requiredFields: ['name', 'entryPoint', 'idpCert'],
};

const hosts: Resource<Host, CreateHostDto, UpdateHostDto> = {
  name: 'hosts',
  getOne: apiService.adminHostControllerGetOne,
  getMany: apiService.adminHostControllerGetAll,
  create: apiService.adminHostControllerCreate,
  update: apiService.adminHostControllerUpdate,
  remove: apiService.adminHostControllerRemove,

  defaultValues: {
    name: '',
    municipalityId: 0,
    domain: '',
    idpId: 0,
  },
  hiddenFields: ['idp'],
  requiredFields: ['name', 'municipalityId', 'idpId'],
};

const resources = { idps, hosts };

export default resources;
