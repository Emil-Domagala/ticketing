import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
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

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    res.cookie('jwt', '', {
      expires: new Date(0),
      secure: process.env.NODE_ENV !== 'test',
      httpOnly: true,
      sameSite: 'none',
    });
    return next(new UnauthorizedError());
  }

  next();
};
