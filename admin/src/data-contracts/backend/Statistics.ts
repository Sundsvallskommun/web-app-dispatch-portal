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

export class Statistics<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Statistics
   * @name StatisticsControllerGetStatistics
   * @summary Return department statistics
   * @request GET:/statistics/departments
   */
  statisticsControllerGetStatistics = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/statistics/departments`,
      method: "GET",
      ...params,
    });
}
