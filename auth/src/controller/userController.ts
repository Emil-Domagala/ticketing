import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/requestValidationError.ts';
import { DatabaseConnectionError } from '../errors/databaseConnectionError.ts';

type ControllerFunctionType = (req: Request, res: Response, next?: NextFunction) => void;

export const currentuser: ControllerFunctionType = (req, res) => {
  res.send('Hi there');
};
export const signin: ControllerFunctionType = (req, res) => {};
export const signout: ControllerFunctionType = (req, res) => {};
export const signup: ControllerFunctionType = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  const { email, password } = req.body;
  console.log('Creaating user');
  res.send({ email, password });
};
