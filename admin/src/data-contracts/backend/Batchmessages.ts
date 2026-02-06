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

export class Batchmessages<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Message
   * @name MessageControllerBatchMessagesInfo
   * @summary Return messages information for batch
   * @request GET:/batchmessages/{id}
   */
  messageControllerBatchMessagesInfo = (
    id: string,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/batchmessages/${id}`,
      method: "GET",
      ...params,
    });
}
