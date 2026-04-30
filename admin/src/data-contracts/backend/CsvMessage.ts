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

import { RequestBodyCsvMail } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class CsvMessage<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Message
   * @name MessageControllerSendCsvMessage
   * @summary Send attachment to recipients from csv file
   * @request POST:/csv-message/
   */
  messageControllerSendCsvMessage = (
    data?: RequestBodyCsvMail & {
      files?: File[];
    },
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/csv-message/`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
}
