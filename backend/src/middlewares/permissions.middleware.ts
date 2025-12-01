import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { Permissions } from '@interfaces/users.interface';
import { logger } from '@utils/logger';

export const hasPermissions = (permissions: Array<keyof Permissions>) => async (req: Request, res: Response, next: NextFunction) => {
  const userPermissions = req.user?.permissions || [];
  if (permissions.every(permission => userPermissions[permission])) {
    next();
  } else {
    logger.error('Missing permissions');
    next(new HttpException(403, 'Missing permissions'));
  }
};
