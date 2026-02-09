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
  deliveryMethod: "DIGITAL_MAIL" | "SNAIL_MAIL" | "DELIVERY_NOT_POSSIBLE";
  address?: Address;
  reason?: string;
  personNumber?: string;
}

export interface Csv {
  name: string;
  id: string;
  status: "OK" | "BAD";
  error?: "UNKNOWN" | "MISSING_VALID_IDS";
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

export interface CreateHostDto {
  name: string;
  municipalityId: number;
  idpId: number;
}

export interface UpdateHostDto {
  name?: string;
  municipalityId?: number;
  idpId?: number;
}

export interface IDP {
  id: number;
  name?: string;
  entryPoint: string;
  idpCert: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  createdAt: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updatedAt: string;
}

export interface IDPApiResponse {
  data: IDP;
  message: string;
}

export interface IDPsApiResponse {
  data: IDP[];
  message: string;
}

export interface Host {
  id: number;
  name?: string;
  municipalityId: number;
  idpId: number;
  idp?: IDP;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  createdAt: string;
  /** @pattern \d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d.\d+Z? */
  updatedAt: string;
}

export interface HostApiResponse {
  data: Host;
  message: string;
}

export interface HostsApiResponse {
  data: Host[];
  message: string;
}

export interface CreateIdpDto {
  name?: string;
  entryPoint: string;
  idpCert: string;
}

export interface UpdateIdpDto {
  name?: string;
  entryPoint?: string;
  idpCert?: string;
}
