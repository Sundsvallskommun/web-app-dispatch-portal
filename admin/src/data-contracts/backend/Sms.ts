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

import { RequestBodySMS } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Sms<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Message
   * @name MessageControllerSendSms
   * @summary Send SMS to recipients
   * @request POST:/sms
   */
  messageControllerSendSms = (
    data?: RequestBodySMS,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/sms`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
