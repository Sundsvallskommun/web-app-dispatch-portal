/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RecipientDto {
  personNumber: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  apartmentNumber?: string;
  careOf?: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface Recipient {
  partyId?: string;
  deliveryMethod: 'DIGITAL_MAIL' | 'SNAIL_MAIL' | 'DELIVERY_NOT_POSSIBLE';
  address?: Address;
  reason?: string;
  personNumber?: string;
}

export interface Csv {
  name: string;
  id: string;
  status: 'OK' | 'BAD';
  error?: 'UNKNOWN' | 'MISSING_VALID_IDS';
  duplicateEntries?: object;
  rejectedEntries?: string[];
}

export interface RecipientApiResponse {
  data: Recipient;
  message: string;
}

export interface RecipientNameApiResponse {
  data: string;
  message: string;
}

export interface CsvApiResponse {
  data: Csv;
  message: string;
}

export interface RequestBodyMail {
  recipients: string;
  addresses: string;
  subject: string;
  body?: string;
}

export interface RequestBodyRecMail {
  recipientPersonId: string;
  subject: string;
  body?: string;
}

export interface RequestBodyCsvMail {
  csvId: string;
  subject: string;
  body?: string;
}

export interface RequestBodySMS {
  /** @minItems 1 */
  recipients: string[];
  message: string;
}

export interface Message {
  recipients?: Recipient[];
  addresses?: Address[];
  recipientPersonId?: string;
  csv?: boolean;
}

export interface MessageApiResponse {
  data: Message;
  message: string;
}

export interface UpdateLogotypeDto {
  name?: string;
  removeDarkMode?: 'true' | 'false';
}

export interface CreateLogotypeDto {
  logotypeLightMode: object;
  logotypeDarkMode?: object;
}

export interface Municipality {
  id: number;
  municipalityId: number;
  name?: string;
  logotypeId?: number;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  createdAt: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updatedAt: string;
}

export interface MunicipalityExtended {
  logotype?: Logotype;
  id: number;
  municipalityId: number;
  name?: string;
  logotypeId?: number;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  createdAt: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updatedAt: string;
}

export interface MunicipalityApiResponse {
  data: MunicipalityExtended;
  message: string;
}

export interface MunicipalitiesApiResponse {
  data: MunicipalityExtended[];
  message: string;
}

export interface Logotype {
  id: number;
  name: string;
  filenameLightMode: string;
  urlLightMode: string;
  filenameDarkMode?: string;
  urlDarkMode?: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  createdAt: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updatedAt: string;
}

export interface LogotypeExtended {
  municipalities: Municipality[];
  id: number;
  name: string;
  filenameLightMode: string;
  urlLightMode: string;
  filenameDarkMode?: string;
  urlDarkMode?: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  createdAt: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updatedAt: string;
}

export interface LogotypeApiResponse {
  data: Logotype;
  message: string;
}

export interface LogotypesApiResponse {
  data: Logotype[];
  message: string;
}

export interface CreateMunicipalityDto {
  municipalityId: number;
  name?: string;
  logotypeId?: number;
}

export interface UpdateMunicipalityDto {
  municipalityId?: number;
  name?: string;
  logotypeId?: number;
}

export interface CreateOrganizationDto {
  orgId: number;
  host: string;
  name?: string;
  logotypeId?: number;
  municipalityId: number;
}

export interface UpdateOrganizationDto {
  orgId?: number;
  host?: string;
  name?: string;
  logotypeId?: number;
  municipalityId?: number;
}

export interface Organization {
  id: number;
  host: string;
  orgId: number;
  name?: string;
  logotypeId?: number;
  municipalityId?: number;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  createdAt: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updatedAt: string;
}

export interface OrganizationExtended {
  municipality: Municipality;
  logotype: Logotype;
  id: number;
  host: string;
  orgId: number;
  name?: string;
  logotypeId?: number;
  municipalityId?: number;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  createdAt: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updatedAt: string;
}

export interface OrganizationApiResponse {
  data: OrganizationExtended;
  message: string;
}

export interface OrganizationsApiResponse {
  data: OrganizationExtended[];
  message: string;
}

export interface AdminUser {
  name: string;
  givenName: string;
  surname: string;
  username: string;
}

export interface AdminUserApiResponse {
  data: AdminUser;
  message: string;
}
