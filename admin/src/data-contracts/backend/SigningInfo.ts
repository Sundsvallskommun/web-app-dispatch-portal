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

export class SigningInfo<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Statistics
   * @name StatisticsControllerGetSigningInfo
   * @summary Return signing info
   * @request GET:/signing-info/{id}
   */
  statisticsControllerGetSigningInfo = (
    id: string,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/signing-info/${id}`,
      method: "GET",
      ...params,
    });
}
