import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.isAuthenticated() && req.user) {
      next();
    } else {
      next(new HttpException(401, 'NOT_AUTHORIZED'));
    }
  } catch (error) {
    next(new HttpException(401, 'AUTH_FAILED'));
  }
};

export default authMiddleware;

