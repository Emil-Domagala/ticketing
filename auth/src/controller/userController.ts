import type { Request, Response, NextFunction } from 'express';
import User from '../model/user.ts';
import { BadRequestError } from '../errors/badRequestError.ts';
import { createToken } from '../utils/jwtToken.ts';
import { PasswordManager } from '../services/passwordManager.ts';

export const currentUser = async (req: Request, res: Response): Promise<void> => {
  res.send({ currentUser: req.currentUser || null });
};

export const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await PasswordManager.compare(user.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }
    const userJwt = createToken(user.email, user.id);
    req.session = { jwt: userJwt };

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const signout = (req: Request, res: Response) => {
  req.session = null;
  res.send({});
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      throw new BadRequestError('Email in use');
    }
    const user = User.build({ email, password });

    await user.save();

    const userJwt = createToken(user.email, user.id);
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};
