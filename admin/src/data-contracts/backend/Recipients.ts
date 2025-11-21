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

import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Recipients<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Recipient
   * @name RecipientControllerRecipients
   * @summary Build list of recipients from CSV file
   * @request POST:/recipients/
   */
  recipientControllerRecipients = (
    data: {
      files?: File[];
    },
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/recipients/`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
}
