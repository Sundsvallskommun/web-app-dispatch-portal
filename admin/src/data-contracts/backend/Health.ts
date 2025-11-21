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

export class Health<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Health
   * @name HealthControllerUp
   * @summary Return health check
   * @request GET:/health/up
   */
  healthControllerUp = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/health/up`,
      method: "GET",
      ...params,
    });
}
