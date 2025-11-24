import { ORIGIN } from '@/config';
import { isValidOrigin } from './isValidOrigin';

const corsWhitelist = ORIGIN?.split(',');

export const isAllowedOrigin = async (origin: string) => {
  if (!origin) return true;
  if (corsWhitelist?.includes('*')) return true;
  const allowed = await isValidOrigin(origin);
  return allowed;
};
