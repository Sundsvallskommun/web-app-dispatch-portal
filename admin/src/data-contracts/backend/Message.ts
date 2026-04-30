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

import { MessageApiResponse, RequestBodyMail } from "./data-contracts";
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
    this.request<MessageApiResponse, any>({
      path: `/message/`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
}
