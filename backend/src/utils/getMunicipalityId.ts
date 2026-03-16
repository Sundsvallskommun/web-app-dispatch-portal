import { RequestWithUser } from '@/interfaces/auth.interface';
import { Request } from 'express';
import { logger } from './logger';
import { ADMIN_CMS_ENABLED, MUNICIPALITY_ID } from '@/config';
import { getHostData, isAdminRequest } from './getHostData';

export const getMunicipalityId = async (req?: Request | RequestWithUser): Promise<string> => {
  if (ADMIN_CMS_ENABLED !== 'true') return MUNICIPALITY_ID;

  if (req) {
    try {
      if (await isAdminRequest(req)) {
        req.session.municipalityId = MUNICIPALITY_ID;
        return MUNICIPALITY_ID;
      }

      const hostData = await getHostData(req);
      if (hostData) {
        req.session.municipalityId = hostData.municipalityId.toString();
        return hostData.municipalityId.toString();
      }
    } catch (e) {
      logger.error('Error getting host:', e);
      throw new Error(`${e}`);
    }
  }

  if (req?.session?.municipalityId) return req.session.municipalityId;
  return MUNICIPALITY_ID;
};
