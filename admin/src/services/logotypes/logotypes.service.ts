import { LogotypeApiResponse, LogotypesApiResponse, UpdateLogotypeDto } from '@data-contracts/backend/data-contracts';
import { ContentType, HttpClient, RequestParams } from '@data-contracts/backend/http-client';

export class LogotypeApi<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerGetLogotypes
   * @summary Get all logotypes
   * @request GET:/admin/logotypes
   */
  adminLogotypeControllerGetLogotypes = (params: RequestParams = {}) =>
    this.request<LogotypesApiResponse, any>({
      path: `/admin/logotypes`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerCreateLogotype
   * @summary Create logotype
   * @request POST:/admin/logotypes
   */
  adminLogotypeControllerCreateLogotype = (
    data?: {
      /** @format binary */
      logotypeLightMode: File;
      /** @format binary */
      logotypeDarkMode?: File;
    },
    params: RequestParams = {}
  ) =>
    this.request<LogotypeApiResponse, any>({
      path: `/admin/logotypes`,
      method: 'POST',
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerGetLogotype
   * @summary Get logotype by id
   * @request GET:/admin/logotypes/{id}
   */
  adminLogotypeControllerGetLogotype = (id: number, params: RequestParams = {}) =>
    this.request<LogotypeApiResponse, any>({
      path: `/admin/logotypes/${id}`,
      method: 'GET',
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerUpdateLogotype
   * @summary Update logotype
   * @request PATCH:/admin/logotypes/{id}
   */
  adminLogotypeControllerUpdateLogotype = (
    id: number,
    data?: UpdateLogotypeDto & {
      /** @format binary */
      logotypeLightMode?: File;
      /** @format binary */
      logotypeDarkMode?: File;
    },
    params: RequestParams = {}
  ) =>
    this.request<LogotypeApiResponse, any>({
      path: `/admin/logotypes/${id}`,
      method: 'PATCH',
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * No description
   *
   * @tags Admin Logotype
   * @name AdminLogotypeControllerDeleteLogotype
   * @summary Update logotype
   * @request DELETE:/admin/logotypes/{id}
   */
  adminLogotypeControllerDeleteLogotype = (id: number, params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/admin/logotypes/${id}`,
      method: 'DELETE',
      ...params,
    });
}
