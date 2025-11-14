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

export class MyStatistics<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Statistics
   * @name StatisticsControllerGetMyStatistics
   * @summary Return my statistics
   * @request GET:/my-statistics
   */
  statisticsControllerGetMyStatistics = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/my-statistics`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Statistics
   * @name StatisticsControllerGetMyStatisticsMessage
   * @summary Return my statistics
   * @request GET:/my-statistics/{id}
   */
  statisticsControllerGetMyStatisticsMessage = (
    id: string,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/my-statistics/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Statistics
   * @name StatisticsControllerGetAttachment
   * @summary Return the attachment
   * @request GET:/my-statistics/attachment/{messageId}/{fileName}
   */
  statisticsControllerGetAttachment = (
    messageId: string,
    fileName: string,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/my-statistics/attachment/${messageId}/${fileName}`,
      method: "GET",
      ...params,
    });
}
