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

export class MyRecLetters<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Statistics
   * @name StatisticsControllerGetMyRecLetters
   * @summary Return my rec letters array
   * @request GET:/my-rec-letters
   */
  statisticsControllerGetMyRecLetters = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/my-rec-letters`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Statistics
   * @name StatisticsControllerGetMyRecLetter
   * @summary Return my rec letter
   * @request GET:/my-rec-letters/{id}
   */
  statisticsControllerGetMyRecLetter = (
    id: string,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/my-rec-letters/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Statistics
   * @name StatisticsControllerGetRecAttachment
   * @summary Return the attachment
   * @request GET:/my-rec-letters/attachment/{letterId}/{attachmentId}
   */
  statisticsControllerGetRecAttachment = (
    letterId: string,
    attachmentId: string,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/my-rec-letters/attachment/${letterId}/${attachmentId}`,
      method: "GET",
      ...params,
    });
}
