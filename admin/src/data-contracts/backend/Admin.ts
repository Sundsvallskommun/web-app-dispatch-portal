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
  CreateHostDto,
  CreateIdpDto,
  HostApiResponse,
  HostsApiResponse,
  IDPApiResponse,
  IDPsApiResponse,
  UpdateHostDto,
  UpdateIdpDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Admin<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
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
  /**
   * No description
   *
   * @tags Admin Host
   * @name AdminHostControllerGetAll
   * @summary Get all hosts
   * @request GET:/admin/hosts
   */
  adminHostControllerGetAll = (params: RequestParams = {}) =>
    this.request<HostsApiResponse, any>({
      path: `/admin/hosts`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Host
   * @name AdminHostControllerCreate
   * @summary Create new host
   * @request POST:/admin/hosts
   */
  adminHostControllerCreate = (
    data?: CreateHostDto,
    params: RequestParams = {},
  ) =>
    this.request<HostApiResponse, any>({
      path: `/admin/hosts`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Host
   * @name AdminHostControllerGetOne
   * @summary Get host by id
   * @request GET:/admin/hosts/{id}
   */
  adminHostControllerGetOne = (id: number, params: RequestParams = {}) =>
    this.request<HostApiResponse, any>({
      path: `/admin/hosts/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Host
   * @name AdminHostControllerUpdate
   * @summary Update a host
   * @request PATCH:/admin/hosts/{id}
   */
  adminHostControllerUpdate = (
    id: number,
    data?: UpdateHostDto,
    params: RequestParams = {},
  ) =>
    this.request<HostApiResponse, any>({
      path: `/admin/hosts/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Host
   * @name AdminHostControllerRemove
   * @summary Delete a host
   * @request DELETE:/admin/hosts/{id}
   */
  adminHostControllerRemove = (id: number, params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/admin/hosts/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Idp
   * @name AdminIdpControllerGetAll
   * @summary Get all idps
   * @request GET:/admin/idps
   */
  adminIdpControllerGetAll = (params: RequestParams = {}) =>
    this.request<IDPsApiResponse, any>({
      path: `/admin/idps`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Idp
   * @name AdminIdpControllerCreate
   * @summary Create new idp
   * @request POST:/admin/idps
   */
  adminIdpControllerCreate = (
    data?: CreateIdpDto,
    params: RequestParams = {},
  ) =>
    this.request<IDPApiResponse, any>({
      path: `/admin/idps`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Idp
   * @name AdminIdpControllerGetOne
   * @summary Get idp by id
   * @request GET:/admin/idps/{id}
   */
  adminIdpControllerGetOne = (id: number, params: RequestParams = {}) =>
    this.request<IDPApiResponse, any>({
      path: `/admin/idps/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Idp
   * @name AdminIdpControllerUpdate
   * @summary Update a idp
   * @request PATCH:/admin/idps/{id}
   */
  adminIdpControllerUpdate = (
    id: number,
    data?: UpdateIdpDto,
    params: RequestParams = {},
  ) =>
    this.request<IDPApiResponse, any>({
      path: `/admin/idps/${id}`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Idp
   * @name AdminIdpControllerRemove
   * @summary Delete a idp
   * @request DELETE:/admin/idps/{id}
   */
  adminIdpControllerRemove = (id: number, params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/admin/idps/${id}`,
      method: "DELETE",
      ...params,
    });
}
