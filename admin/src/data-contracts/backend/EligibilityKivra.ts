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

import { RequestBodyEligibility } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class EligibilityKivra<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Recipient
   * @name RecipientControllerCheckEligibilityKivra
   * @summary Checks if the recipients are eligible for Kivra
   * @request POST:/eligibility-kivra
   */
  recipientControllerCheckEligibilityKivra = (
    data?: RequestBodyEligibility,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/eligibility-kivra`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
