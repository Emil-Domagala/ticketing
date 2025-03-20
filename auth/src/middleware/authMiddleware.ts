import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorizedError';

export interface UserPayload {
  email: string;
  userId: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_KEY!, async (err: any, payload: any) => {
    if (err) {
      res.cookie('jwt', '', {
        expires: new Date(0),
        secure: process.env.NODE_ENV !== 'test',
        httpOnly: true,
        sameSite: 'none',
      });
      throw new UnauthorizedError();
    }
    req.currentUser = payload;
  });
  next();
};

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }
  next();
};
