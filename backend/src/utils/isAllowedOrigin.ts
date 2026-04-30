import { isValidOrigin } from './isValidOrigin';

export const isAllowedOrigin = async (origin: string) => {
  if (!origin) return true;
  return isValidOrigin(origin);
};
