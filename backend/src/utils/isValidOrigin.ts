import { ORIGIN } from '@/config';
import prisma from './prisma';

export const isValidOrigin = async (url: string): Promise<boolean> => {
  if (ORIGIN === '*') return true;

  const allowedOrigins = ORIGIN.split(',')
    .map(origin => origin.trim())
    .filter(origin => origin !== '');

  const hosts = (await prisma.host.findMany()).map(host => host.name);

  const urlObj = new URL(url);
  const origin = urlObj.origin;
  const host = urlObj.host;

  return allowedOrigins.includes(origin) || hosts.includes(host);
};
