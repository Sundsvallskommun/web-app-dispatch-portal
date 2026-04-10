import { RequestWithUser } from '@/interfaces/auth.interface';
import { Request } from 'express';
import { getRedirects } from './getRedirects';
import prisma from './prisma';
import { logger } from './logger';
import { ADMIN_CMS_ENABLED, MUNICIPALITY_ID } from '@/config';

const DEFAULT_NAMESPACE = 'PERSONAL';

interface MunicipalityInfo {
  municipalityId: string;
  domain: string;
}

export const getMunicipalityInfo = async (req?: Request | RequestWithUser): Promise<MunicipalityInfo> => {
  if (ADMIN_CMS_ENABLED !== 'true') return { municipalityId: MUNICIPALITY_ID, domain: DEFAULT_NAMESPACE };
  if (req?.body?.RelayState) {
    try {
      const { host } = await getRedirects(req);
      const hostData = await prisma.host.findUnique({ where: { name: host ?? '' } });
      if (hostData) {
        req.session.municipalityId = hostData.municipalityId.toString();
        return {
          municipalityId: hostData.municipalityId.toString(),
          domain: hostData.domain ?? DEFAULT_NAMESPACE,
        };
      }
    } catch (e) {
      logger.error('Error getting host:', e);
      throw new Error(e);
    }
  }
  if (req.session.municipalityId)
    return { municipalityId: req.session.municipalityId, domain: req.session.domain ?? DEFAULT_NAMESPACE };
  return { municipalityId: MUNICIPALITY_ID, domain: DEFAULT_NAMESPACE };
};

export const getMunicipalityId = async (req?: Request | RequestWithUser): Promise<string> => {
  const { municipalityId } = await getMunicipalityInfo(req);
  return municipalityId;
};
