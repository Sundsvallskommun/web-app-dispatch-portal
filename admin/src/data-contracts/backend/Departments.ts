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

import { HttpClient, RequestParams } from "./http-client";

export class Departments<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Departments
   * @name DepartmentsControllerGetMergedDepartments
   * @summary Return all available departments (and companies)
   * @request GET:/departments
   */
  departmentsControllerGetMergedDepartments = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/departments`,
      method: "GET",
      ...params,
    });
}
