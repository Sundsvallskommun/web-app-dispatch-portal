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

import { HttpClient, RequestParams } from "./http-client";

export class User<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags User
   * @name UserControllerGetMyEmployeeImage
   * @summary Return logged in person image
   * @request GET:/user/avatar
   */
  userControllerGetMyEmployeeImage = (
    query?: {
      width?: any;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/user/avatar`,
      method: "GET",
      query: query,
      ...params,
    });
}
