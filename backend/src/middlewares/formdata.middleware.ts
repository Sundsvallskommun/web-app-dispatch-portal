import { RequestWithUser } from '@/interfaces/auth.interface';
import { logger } from '@/utils/logger';
import { HttpException } from '@exceptions/HttpException';
import { NextFunction, Response } from 'express';

const formDataMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    if (req?.body) {
      const keys = Object.keys(req.body);
      const newBody = keys?.reduce((data, key) => {
        if (req.body[key] === 'undefined' || req.body[key] === '' || req.body[key] === 'null') return { ...data };
        return { ...data, [key]: req.body[key] };
      }, {});
      req.body = newBody;
    }
    next();
  } catch (error) {
    logger.error('Error in logotype middleware', error);
    next(new HttpException(500, 'Server error'));
  }
};

export default formDataMiddleware;
