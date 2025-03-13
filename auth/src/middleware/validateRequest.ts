import { RequestValidationError } from '../errors/requestValidationError.ts';
import type { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateSignup = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be beetwen 4 and 20 characters'),
];

export const checkIfErrorsFromValidator = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};
