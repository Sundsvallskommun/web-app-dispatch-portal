import { ADMIN_CMS_ENABLED, ORIGIN } from '@/config';
import prisma from './prisma';

export const isValidOrigin = async (url: string): Promise<boolean> => {
  if (ORIGIN === '*') return true;

  const urlObj = new URL(url);
  const originFromUrl = urlObj.origin;

  const allowedOrigins = ORIGIN.split(',')
    .map(origin => origin.trim())
    .filter(origin => origin !== '');

  if (ADMIN_CMS_ENABLED === 'true') {
    const hostsFromDb = await prisma.host.findMany({ include: { idp: true } });
    const hosts = hostsFromDb.map(host => host.name);
    const idps = hostsFromDb.map(host => new URL(host.idp.entryPoint).host);
    const host = urlObj.host;

    return allowedOrigins.includes(originFromUrl) || [...hosts, ...idps].includes(host);
  }

  return allowedOrigins.includes(originFromUrl);
};
