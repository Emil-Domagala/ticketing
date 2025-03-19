import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorizedError';

export interface UserPayload {
  email: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.session);
  if (!req.session?.jwt) {
    console.log('First if');
    return next();
  }

  try {
    console.log('Trying to verify');
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    console.log('Got payload');
    req.currentUser = payload;
  } catch (err) {}

  next();
};

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }
  next();
};
