import { Organization } from '@prisma/client';
import { Request } from 'express';
import { getOrigin } from './getOrigin';
import { logger } from './logger';
import prisma from './prisma';

/**
 * Get Organization and Municipality from host
 * If not host is not provided, req.hostname will be used.
 * @param req Request or RequestWithUser
 * @param origin optional
 * @returns { Organization, MunicipalityId, host }
 */
export const getOrganization = async (
  req: Request,
  origin?: string,
): Promise<{ organization: Organization; municipalityId: number; origin: string }> => {
  if (req.session.organization && req.session.municipalityId) {
    return {
      municipalityId: req.session.municipalityId,
      organization: req.session.organization,
      origin: req.session.origin,
    };
  }
  try {
    let host = origin ?? getOrigin(req);

    const organization = await prisma.organization.findFirst({
      where: { host },
    });
    if (!organization) {
      throw new Error('No organization found');
    }
    const { municipalityId } = organization;
    req.session.origin = host;
    req.session.municipalityId = municipalityId;
    req.session.organization = organization;
    return { municipalityId, organization, origin: host };
  } catch (error) {
    logger.error('Could not get organization: ', error);
    throw new Error('Could not get organization');
  }
};
