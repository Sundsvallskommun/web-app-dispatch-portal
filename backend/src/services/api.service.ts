import { HttpException } from '@/exceptions/HttpException';
import { apiURL } from '@/utils/util';
import { logger } from '@utils/logger';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ApiTokenService from './api-token.service';
import { User } from '@/interfaces/users.interface';

export class ApiResponse<T> {
  data: T;
  message: string;
}

const apiTokenService = new ApiTokenService();

class ApiService {
  private instance: AxiosInstance;
  constructor() {
    this.instance = axios.create();
    this.instance.interceptors.request.use(
      async function (request) {
        if (request.url === apiURL('token')) {
          return Promise.resolve(request);
        }
        const token = await apiTokenService.getToken();
        const defaultHeaders = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Request-Id': uuidv4(),
        };
        request.headers = request.headers.concat(defaultHeaders);
        return Promise.resolve(request);
      },
      function (error) {
        return Promise.reject(error);
      },
    );

    // this.instance.interceptors.response.use(
    //   async function (response) {
    //     if (response.headers.location) {
    //       logger.info(`Response contained location header: ${response.headers.location}`);
    //       const token = await apiTokenService.getToken();
    //       const defaultHeaders = {
    //         Authorization: `Bearer ${token}`,
    //         'Content-Type': 'application/json',
    //         'X-Request-Id': uuidv4(),
    //       };
    //       return axios.get(response.headers.location, { headers: defaultHeaders }).catch(e => {
    //         console.error('Error in location header request:', e);
    //         logger.error('Error in location header request:', e);
    //         throw e;
    //       });
    //     }
    //     return Promise.resolve(response);
    //   },
    //   function (error) {
    //     return Promise.reject(error);
    //   },
    // );
  }
  private async request<T>(config: AxiosRequestConfig, user: User): Promise<ApiResponse<T>> {
    const defaultParams = {};
    const preparedConfig: AxiosRequestConfig = {
      ...config,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: { ...config.headers, 'x-issuer': user.username },
      params: { ...defaultParams, ...config.params },
      url: apiURL(config.url),
    };
    console.log('REQUEST CONFIG HEADERS', preparedConfig.headers);
    try {
      const res = await this.instance(preparedConfig);
      return { data: res.data, message: 'success' };
    } catch (error: unknown | AxiosError) {
      if (axios.isAxiosError(error) && (error as AxiosError).response?.status === 404) {
        console.error(`API request 404:ed for url: ${error.response.config.url}`);
        throw new HttpException(404, 'Not found');
      } else if (axios.isAxiosError(error) && (error as AxiosError).response?.data) {
        console.error(`ERROR: API request failed with status: ${error.response?.status}`);
        console.error('Error details:', error.response.data);
        console.error('Error url:', error.response.config.url);
        console.error('Error data:', error.response.config.data);
        console.error('Error method:', error.response.config.method);
        console.error('Error headers:', error.response.config.headers);
        logger.error(`ERROR: API request failed with status: ${error.response?.status}`);
        logger.error('Error details:', error.response.data);
        logger.error('Error url:', error.response.config.url);
        logger.error('Error data:', error.response.config.data);
        logger.error('Error method:', error.response.config.method);
        logger.error('Error headers:', error.response.config.headers);
      } else {
        console.error('Unknown error:', error);
        logger.error('Unknown error:', error);
      }
      throw new HttpException(500, 'Internal server error');
    }
  }

  public async get<T>(config: AxiosRequestConfig, user: User): Promise<ApiResponse<T>> {
    console.log('MAKING GET REQUEST TO URL', config.url);
    return this.request<T>({ ...config, method: 'GET' }, user);
  }

  public async post<T, D>(config: AxiosRequestConfig<D>, user: User): Promise<ApiResponse<T>> {
    console.log('MAKING POST REQUEST TO URL', config.url);
    return this.request<T>({ ...config, method: 'POST' }, user);
  }

  public async patch<T, D>(config: AxiosRequestConfig<D>, user: User): Promise<ApiResponse<T>> {
    console.log('MAKING PATCH REQUEST TO URL', config.url);
    return this.request<T>({ ...config, method: 'PATCH' }, user);
  }

  public async put<T, D>(config: AxiosRequestConfig<D>, user: User): Promise<ApiResponse<T>> {
    console.log('MAKING PUT REQUEST TO URL', config.url);
    return this.request<T>({ ...config, method: 'PUT' }, user);
  }

  public async delete<T>(config: AxiosRequestConfig, user: User): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE' }, user);
  }
}
export default ApiService;
