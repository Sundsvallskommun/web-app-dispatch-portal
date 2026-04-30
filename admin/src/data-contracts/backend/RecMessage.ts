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

import { RequestBodyRecMail } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class RecMessage<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Message
   * @name MessageControllerSendRecMessage
   * @summary Send attachment as registered letter to recipients
   * @request POST:/rec-message/
   */
  messageControllerSendRecMessage = (
    data?: RequestBodyRecMail & {
      files?: File[];
    },
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/rec-message/`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
}
