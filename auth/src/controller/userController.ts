import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/requestValidationError.ts';
import User from '../model/user.ts';
import { BadRequestError } from '../errors/badRequestError.ts';

export const currentuser = async (req: Request, res: Response) => {
  res.send('Hi there');
};
export const signin = (req: Request, res: Response) => {};
export const signout = (req: Request, res: Response) => {};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    const user = User.build({ email, password });

    await user.save();
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};
