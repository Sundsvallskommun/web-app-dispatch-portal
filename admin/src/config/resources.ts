import { Admin } from '@data-contracts/backend/Admin';
import {
  CreateMunicipalityDto,
  CreateOrganizationDto,
  Logotype,
  Municipality,
  Organization,
  UpdateLogotypeDto,
  UpdateMunicipalityDto,
  UpdateOrganizationDto,
} from '@data-contracts/backend/data-contracts';
import { Resource } from '@interfaces/resource';
import { LogotypeApi } from '@services/logotypes/logotypes.service';

const apiService = new Admin({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PATH}`,
  withCredentials: true,
});
const logoApiService = new LogotypeApi({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PATH}`,
  withCredentials: true,
});

interface LogotypeFiles {
  logotypeLightMode: File;
  logotypeDarkMode?: File;
}

const logotypes: Resource<Logotype, LogotypeFiles, UpdateLogotypeDto & LogotypeFiles> = {
  name: 'logotypes',
  getOne: logoApiService.adminLogotypeControllerGetLogotype,
  getMany: logoApiService.adminLogotypeControllerGetLogotypes,
  create: logoApiService.adminLogotypeControllerCreateLogotype,
  update: logoApiService.adminLogotypeControllerUpdateLogotype,
  remove: logoApiService.adminLogotypeControllerDeleteLogotype,

  defaultValues: {
    logotypeLightMode: undefined,
  },
  requiredFields: ['logotypeLightMode'],
};

const municipalities: Resource<Municipality, CreateMunicipalityDto, UpdateMunicipalityDto> = {
  name: 'municipalities',
  getOne: apiService.adminMunicipalityControllerGetMunicipality,
  getMany: apiService.adminMunicipalityControllerGetMunicipalities,
  create: apiService.adminMunicipalityControllerCreateMunicipality,
  update: apiService.adminMunicipalityControllerUpdateMunicipality,
  remove: apiService.adminMunicipalityControllerDeleteMunicipality,

  defaultValues: {
    municipalityId: 0,
  },
  requiredFields: ['municipalityId'],
};

const organizations: Resource<Organization, CreateOrganizationDto, UpdateOrganizationDto> = {
  name: 'organizations',
  getOne: apiService.adminOrganizationControllerGetOrganization,
  getMany: apiService.adminOrganizationControllerGetOrganizations,
  create: apiService.adminOrganizationControllerCreateOrganization,
  update: apiService.adminOrganizationControllerUpdateOrganization,
  remove: apiService.adminOrganizationControllerDeleteOrganization,

  defaultValues: {
    orgId: 0,
    host: '',
    municipalityId: 0,
  },
  requiredFields: ['orgId', 'host', 'municipalityId'],
};

const resources = { municipalities, logotypes, organizations };

export default resources;
