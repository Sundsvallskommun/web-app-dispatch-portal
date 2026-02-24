import { RequestWithUser } from '@/interfaces/auth.interface';
import { Request } from 'express';
import { getRedirects } from './getRedirects';
import prisma from './prisma';
import { logger } from './logger';
import { ADMIN_CMS_ENABLED, MUNICIPALITY_ID } from '@/config';

export const getMunicipalityId = async (req?: Request | RequestWithUser): Promise<string> => {
  if (ADMIN_CMS_ENABLED !== 'true') return MUNICIPALITY_ID;
  if (req?.body?.RelayState) {
    try {
      const { host } = await getRedirects(req);
      const hostData = await prisma.host.findUnique({ where: { name: host ?? '' } });
      if (hostData) {
        req.session.municipalityId = hostData.municipalityId.toString();
        return hostData.municipalityId.toString();
      }
    } catch (e) {
      logger.error('Error getting host:', e);
      throw new Error(e);
    }
  }
  if (req.session.municipalityId) return req.session.municipalityId;
  return MUNICIPALITY_ID;
};
