import { Request } from 'express';
import prisma from './prisma';
import { logger } from './logger';
import { ADMIN_URL } from '@/config';
import { getRedirects } from './getRedirects';

const CERTIFICATE_PREFIX = '-----BEGIN CERTIFICATE-----\n';
const CERTIFICATE_SUFFIX = '\n-----END CERTIFICATE-----';

const normalizeHost = (value?: string | string[]): string | undefined => {
  if (!value) return undefined;

  const rawValue = Array.isArray(value) ? value[0] : value;
  const forwardedHost = rawValue.split(',')[0].trim();

  if (!forwardedHost) return undefined;

  try {
    const url = forwardedHost.includes('://') ? new URL(forwardedHost) : new URL(`https://${forwardedHost}`);
    return url.hostname.toLowerCase();
  } catch {
    return forwardedHost.split(':')[0].toLowerCase();
  }
};

export const normalizeCertificate = (value?: string | null): string | null | undefined => {
  if (!value) return value;

  const trimmedValue = value.trim().replace(/^"|"$/g, '').replace(/\\n/g, '\n');
  const withPrefix = trimmedValue.startsWith(CERTIFICATE_PREFIX) ? trimmedValue : `${CERTIFICATE_PREFIX}${trimmedValue}`;
  return withPrefix.endsWith(CERTIFICATE_SUFFIX) ? withPrefix : `${withPrefix}${CERTIFICATE_SUFFIX}`;
};

export const getRequestHost = (req: Request): string | undefined => {
  if (!req) return undefined;

  const queryHost = typeof req.query?.host === 'string' ? req.query.host : undefined;
  const originHost = normalizeHost(req.headers?.origin);
  const refererHost = normalizeHost(req.headers?.referer);
  const forwardedHost = normalizeHost(req.headers?.['x-forwarded-host']);
  const headerHost = normalizeHost(req.headers?.host);

  return normalizeHost(queryHost) ?? originHost ?? refererHost ?? forwardedHost ?? headerHost;
};

export const resolveRequestHost = async (req: Request): Promise<string | undefined> => {
  let resolvedHost: string | undefined;

  try {
    const { host } = await getRedirects(req);
    resolvedHost = normalizeHost(host);
  } catch (error) {
    logger.warn('Could not parse RelayState host, falling back to request host', error);
  }

  return resolvedHost ?? getRequestHost(req);
};

export const isAdminRequest = async (req: Request): Promise<boolean> => {
  const adminHost = normalizeHost(ADMIN_URL);
  const requestHost = await resolveRequestHost(req);

  return Boolean(adminHost && requestHost && adminHost === requestHost);
};

export const getHostData = async (req: Request) => {
  const resolvedHost = await resolveRequestHost(req);

  if (!resolvedHost) return null;

  try {
    const hostData = await prisma.host.findUnique({
      where: { name: resolvedHost },
      include: { idp: true },
    });

    if (!hostData?.idp) return hostData;

    return {
      ...hostData,
      idp: {
        ...hostData.idp,
        idpCert: normalizeCertificate(hostData.idp.idpCert) ?? hostData.idp.idpCert,
      },
    };
  } catch (error) {
    logger.error(`Error getting host data for '${resolvedHost}'`, error);
    return null;
  }
};
