import { ADMIN_CMS_ENABLED, ORIGIN } from '@/config';
import prisma from './prisma';

export const isValidOrigin = async (url: string): Promise<boolean> => {
  if (ORIGIN === '*') return true;

  const allowedOrigins = ORIGIN.split(',')
    .map(origin => origin.trim())
    .filter(origin => origin !== '');

  if (ADMIN_CMS_ENABLED === 'true') {
    const hosts = (await prisma.host.findMany()).map(host => host.name);
    const urlObj = new URL(url);
    const originFromUrl = urlObj.origin;
    const host = urlObj.host;

    return allowedOrigins.includes(originFromUrl) || hosts.includes(host);
  }

  return allowedOrigins.includes(origin);
};
