import { ApiResponse } from '@services/api-service';

export const apiResponse = <T = unknown>(data: T): ApiResponse<T> => ({ message: 'success', data });
