import { RequestWithUser } from '@/interfaces/auth.interface';
import { Request } from 'express';
import { getRedirects } from './getRedirects';
import prisma from './prisma';
import { logger } from './logger';
import { MUNICIPALITY_ID } from '@/config';

export const getMunicipalityId = async (req?: Request | RequestWithUser): Promise<string> => {
  if (req.session.municipalityId) return req.session.municipalityId;

  try {
    const { host } = getRedirects(req);

    const hostData = await prisma.host.findUnique({ where: { name: host ?? '' } });
    if (host && hostData) {
      req.session.municipalityId = hostData.municipalityId.toString();
      return hostData.municipalityId.toString();
    }

    return MUNICIPALITY_ID;
  } catch (e) {
    logger.error('Error getting host:', e);
    throw new Error(e);
  }
};
