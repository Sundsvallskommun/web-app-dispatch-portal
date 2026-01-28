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

export class MyDepartment<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Departments
   * @name DepartmentsControllerGetMyDepartment
   * @summary Return all available departments (and companies)
   * @request GET:/my-department
   */
  departmentsControllerGetMyDepartment = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/my-department`,
      method: "GET",
      ...params,
    });
}
