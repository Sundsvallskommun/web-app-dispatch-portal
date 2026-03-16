import { RequestWithUser } from '@/interfaces/auth.interface';
import { InternalRoleEnum } from '@/interfaces/users.interface';
import { logger } from '@/utils/logger';
import { HttpException } from '@exceptions/HttpException';
import { NextFunction, Response } from 'express';

const adminMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const roles = req.user?.roles;
    console.log('🚀 ~ adminMiddleware ~ roles:', roles);

    if (Array.isArray(roles) && roles.includes(InternalRoleEnum.Admin)) {
      next();
    } else {
      next(new HttpException(401, 'MISSING_PERMISSIONS'));
    }
  } catch (error) {
    logger.error('Error in admin middleware', error);
    next(new HttpException(401, 'AUTH_FAILED'));
  }
};

export default adminMiddleware;
