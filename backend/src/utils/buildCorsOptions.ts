import { BASE_URL_PREFIX, CREDENTIALS, NODE_ENV } from '@config';
import { CorsOptions } from 'cors';
import { isAllowedOrigin } from './isAllowedOrigin';

const samlCorsBypassPaths = new Set([
  `${BASE_URL_PREFIX}/saml/login/callback`,
  `${BASE_URL_PREFIX}/saml/logout/callback`,
]);

export const shouldBypassCorsCheck = (path: string): boolean => samlCorsBypassPaths.has(path);

export const isCorsOriginAllowedForPath = async (path: string, origin?: string): Promise<boolean> => {
  if (shouldBypassCorsCheck(path)) {
    return true;
  }

  const allowed = await isAllowedOrigin(origin);
  return allowed || NODE_ENV === 'development';
};

export const buildCorsOptions = (path: string): CorsOptions => ({
  credentials: CREDENTIALS,
  origin: async (origin, callback) => {
    try {
      const allowed = await isCorsOriginAllowedForPath(path, origin);

      if (allowed) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    } catch (error) {
      return callback(error as Error);
    }
  },
});
