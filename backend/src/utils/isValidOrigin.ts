import { ADMIN_URL, ORIGIN } from '@/config';
import prisma from './prisma';

export const isValidOrigin = async (url: string): Promise<boolean> => {
  const orgOrigins = await prisma.organization.findMany({ select: { host: true } });
  const corsWhitelist = ORIGIN?.split(',');
  const adminOrigin = new URL(ADMIN_URL).origin;

  const allOrigins = [...corsWhitelist, ...orgOrigins.map(org => org.host), adminOrigin];

  const allowedOrigins = allOrigins.map(origin => origin.trim()).filter(origin => origin !== '');
  const origin = new URL(url).origin;
  return allowedOrigins.includes(origin);
};
