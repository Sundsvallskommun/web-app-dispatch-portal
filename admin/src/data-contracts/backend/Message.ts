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

import { RequestBodyMail } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Message<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Message
   * @name MessageControllerRecipients
   * @summary Send attachment to recipients
   * @request POST:/message/
   */
  messageControllerRecipients = (
    data?: RequestBodyMail & {
      files?: File[];
    },
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/message/`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * No description
   *
   * @tags Message
   * @name MessageControllerMessageInfo
   * @summary Return message information
   * @request GET:/message/{id}
   */
  messageControllerMessageInfo = (id: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/message/${id}`,
      method: "GET",
      ...params,
    });
}
