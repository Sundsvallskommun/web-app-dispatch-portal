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

import { RequestBodyCsvSMS } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class CsvSms<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Message
   * @name MessageControllerSendCsvSms
   * @summary Send sms to recipients from csv file
   * @request POST:/csv-sms/
   */
  messageControllerSendCsvSms = (
    data?: RequestBodyCsvSMS,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/csv-sms/`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
