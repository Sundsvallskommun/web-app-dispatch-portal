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

import { RecipientBody } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Recipient<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Recipient
   * @name RecipientControllerRecipient
   * @summary Build list with single recipient from personal number
   * @request POST:/recipient
   */
  recipientControllerRecipient = (
    data?: RecipientBody,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/recipient`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
