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

export class Receipt<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Statistics
   * @name StatisticsControllerGetReceipt
   * @summary Return receipt PDF
   * @request GET:/receipt/{id}
   */
  statisticsControllerGetReceipt = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/receipt/${id}`,
      method: "GET",
      ...params,
    });
}
