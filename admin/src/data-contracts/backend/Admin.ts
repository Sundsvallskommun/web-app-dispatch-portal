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

import {
  AdminUserApiResponse,
  CreateMunicipalityDto,
  CreateOrganizationDto,
  LogotypeApiResponse,
  LogotypesApiResponse,
  MunicipalitiesApiResponse,
  MunicipalityApiResponse,
  OrganizationApiResponse,
  OrganizationsApiResponse,
  UpdateLogotypeDto,
  UpdateMunicipalityDto,
  UpdateOrganizationDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Admin<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerGetLogotypes
   * @summary Get all logotypes
   * @request GET:/admin/logotypes
   */
  adminLogotypeControllerGetLogotypes = (params: RequestParams = {}) =>
    this.request<LogotypesApiResponse, any>({
      path: `/admin/logotypes`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerCreateLogotype
   * @summary Create logotype
   * @request POST:/admin/logotypes
   */
  adminLogotypeControllerCreateLogotype = (params: RequestParams = {}) =>
    this.request<LogotypeApiResponse, any>({
      path: `/admin/logotypes`,
      method: "POST",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerGetLogotype
   * @summary Get logotype by id
   * @request GET:/admin/logotypes/{id}
   */
  adminLogotypeControllerGetLogotype = (
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<LogotypeApiResponse, any>({
      path: `/admin/logotypes/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerUpdateLogotype
   * @summary Update logotype
   * @request PATCH:/admin/logotypes/{id}
   */
  adminLogotypeControllerUpdateLogotype = (
    id: number,
    data?: UpdateLogotypeDto,
    params: RequestParams = {},
  ) =>
    this.request<LogotypeApiResponse, any>({
      path: `/admin/logotypes/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerDeleteLogotype
   * @summary Update logotype
   * @request DELETE:/admin/logotypes/{id}
   */
  adminLogotypeControllerDeleteLogotype = (
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<any, any>({
      path: `/admin/logotypes/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Municipality
   * @name AdminMunicipalityControllerGetMunicipalities
   * @summary Get all municipalities
   * @request GET:/admin/municipalities
   */
  adminMunicipalityControllerGetMunicipalities = (params: RequestParams = {}) =>
    this.request<MunicipalitiesApiResponse, any>({
      path: `/admin/municipalities`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Municipality
   * @name AdminMunicipalityControllerCreateMunicipality
   * @summary Create new municipality
   * @request POST:/admin/municipalities
   */
  adminMunicipalityControllerCreateMunicipality = (
    data?: CreateMunicipalityDto,
    params: RequestParams = {},
  ) =>
    this.request<MunicipalityApiResponse, any>({
      path: `/admin/municipalities`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Municipality
   * @name AdminMunicipalityControllerGetMunicipality
   * @summary Get municipality by id
   * @request GET:/admin/municipalities/{id}
   */
  adminMunicipalityControllerGetMunicipality = (
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<MunicipalityApiResponse, any>({
      path: `/admin/municipalities/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Municipality
   * @name AdminMunicipalityControllerUpdateMunicipality
   * @summary Update a municipality
   * @request PATCH:/admin/municipalities/{id}
   */
  adminMunicipalityControllerUpdateMunicipality = (
    id: number,
    data?: UpdateMunicipalityDto,
    params: RequestParams = {},
  ) =>
    this.request<MunicipalityApiResponse, any>({
      path: `/admin/municipalities/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Municipality
   * @name AdminMunicipalityControllerDeleteMunicipality
   * @summary Delete a municipality
   * @request DELETE:/admin/municipalities/{id}
   */
  adminMunicipalityControllerDeleteMunicipality = (
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<any, any>({
      path: `/admin/municipalities/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Organization
   * @name AdminOrganizationControllerGetOrganizations
   * @summary Get all organizations
   * @request GET:/admin/organizations
   */
  adminOrganizationControllerGetOrganizations = (params: RequestParams = {}) =>
    this.request<OrganizationsApiResponse, any>({
      path: `/admin/organizations`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Organization
   * @name AdminOrganizationControllerCreateOrganization
   * @summary Create new organization
   * @request POST:/admin/organizations
   */
  adminOrganizationControllerCreateOrganization = (
    data?: CreateOrganizationDto,
    params: RequestParams = {},
  ) =>
    this.request<OrganizationApiResponse, any>({
      path: `/admin/organizations`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Organization
   * @name AdminOrganizationControllerGetOrganization
   * @summary Get organization by id
   * @request GET:/admin/organizations/{id}
   */
  adminOrganizationControllerGetOrganization = (
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<OrganizationApiResponse, any>({
      path: `/admin/organizations/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Organization
   * @name AdminOrganizationControllerUpdateOrganization
   * @summary Update a organization
   * @request PATCH:/admin/organizations/{id}
   */
  adminOrganizationControllerUpdateOrganization = (
    id: number,
    data?: UpdateOrganizationDto,
    params: RequestParams = {},
  ) =>
    this.request<OrganizationApiResponse, any>({
      path: `/admin/organizations/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Organization
   * @name AdminOrganizationControllerDeleteOrganization
   * @summary Delete a organization
   * @request DELETE:/admin/organizations/{id}
   */
  adminOrganizationControllerDeleteOrganization = (
    id: number,
    params: RequestParams = {},
  ) =>
    this.request<any, any>({
      path: `/admin/organizations/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin User
   * @name AdminUserControllerGetUser
   * @summary Return current admin user
   * @request GET:/admin/me
   */
  adminUserControllerGetUser = (params: RequestParams = {}) =>
    this.request<AdminUserApiResponse, any>({
      path: `/admin/me`,
      method: "GET",
      ...params,
    });
}
