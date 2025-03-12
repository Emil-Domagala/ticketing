import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/customError.ts';
import { InternalServerError } from '../errors/internalServerError.ts';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  const defaultError = new InternalServerError();
  res.status(defaultError.statusCode).send({ errors: defaultError.serializeErrors() });

};
