import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/customError.ts';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
};
