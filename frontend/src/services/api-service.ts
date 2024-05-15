import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import { apiURL } from '@utils/api-url';

export interface Data {
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let isRedirectingToLogin = false;

Router.events.on('routeChangeComplete', (route) => {
  isRedirectingToLogin = false;
  if (route === '/login') {
    isRedirectingToLogin = false;
  }
});

export const handleError = (error: AxiosError) => {
  if (error.response?.status === 401 && Router.pathname !== '/login' && !isRedirectingToLogin) {
    isRedirectingToLogin = true;
    Router.push(`${process.env.NEXT_PUBLIC_API_URL}/saml/login`);
  }

  throw error;
};

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const get = <T>(url: string, options?: { [key: string]: any }) =>
  axios.get<T>(apiURL(url), { ...defaultOptions, ...options }).catch(handleError);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const post = <T, U>(url: string, data: U, options?: { [key: string]: any }) => {
  return axios.post<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remove = <T>(url: string, options?: { [key: string]: any }) => {
  return axios.delete<T>(apiURL(url), { ...defaultOptions, ...options }).catch(handleError);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const patch = <T, U>(url: string, data: U, options?: { [key: string]: any }) => {
  return axios.patch<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const put = <T, U>(url: string, data: U, options?: { [key: string]: any }) => {
  return axios.put<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);
};

export const apiService = { get, post, put, patch, delete: remove };
