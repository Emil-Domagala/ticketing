import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/unauthorizedError';

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return next(new UnauthorizedError());
  }
  next();
};
