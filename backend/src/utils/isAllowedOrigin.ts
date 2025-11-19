import { ORIGIN } from '@/config';
import { isValidOrigin } from './isValidOrigin';

const corsWhitelist = ORIGIN?.split(',');

export const isAllowedOrigin = (origin: string) => {
  if (!origin) return true;
  if (corsWhitelist?.includes('*')) return true;
  return isValidOrigin(origin);
};
