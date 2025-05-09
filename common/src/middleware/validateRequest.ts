import { RequestValidationError } from '../errors/requestValidationError';
import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';



export const checkIfErrorsFromValidator = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  next();
};
