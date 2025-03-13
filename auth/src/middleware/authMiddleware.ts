import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtToken.ts';
import type { UserPayload } from '../utils/jwtToken.ts';
import { UnauthorizedError } from '../errors/unauthorizedError.ts';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) return next();

  try {
    const payload = verifyToken(req.session.jwt);
    req.currentUser = payload;
  } catch (err) {
    res.send({ currentUser: null });
  }
  next();
};

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }
  next();
};
