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

export class Batchstatus<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Message
   * @name MessageControllerStatus
   * @summary Return batch status
   * @request GET:/batchstatus/{id}
   */
  messageControllerStatus = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/batchstatus/${id}`,
      method: "GET",
      ...params,
    });
}
