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

import {
  CsvApiResponse,
  RecipientApiResponse,
  RecipientDto,
  RecipientNameApiResponse,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Recipient<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Recipient
   * @name RecipientControllerRecipient
   * @summary Get single recipient from personal number
   * @request POST:/recipient
   */
  recipientControllerRecipient = (
    query?: {
      force_kivra?: boolean;
    },
    data?: RecipientDto,
    params: RequestParams = {},
  ) =>
    this.request<RecipientApiResponse, any>({
      path: `/recipient`,
      method: "POST",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Recipient
   * @name RecipientControllerGetCitizen
   * @summary Return person name by personId
   * @request GET:/recipient/{personId}/name
   */
  recipientControllerGetCitizen = (
    personId: string,
    params: RequestParams = {},
  ) =>
    this.request<RecipientNameApiResponse, any>({
      path: `/recipient/${personId}/name`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Recipient
   * @name RecipientControllerGetCsvStatus
   * @summary Check status of csv-file and save to session
   * @request POST:/recipient/csv
   */
  recipientControllerGetCsvStatus = (
    data: {
      /** @format binary */
      csv: File;
    },
    params: RequestParams = {},
  ) =>
    this.request<CsvApiResponse, any>({
      path: `/recipient/csv`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
}
