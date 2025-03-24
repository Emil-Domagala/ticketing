import type { Request, Response, NextFunction } from 'express';
import User from '../model/user';
import { BadRequestError } from '@emil_tickets/common';
import { PasswordManager } from '../services/passwordManager';
import jwt from 'jsonwebtoken';

const tokenExpiration = 60 * 60 * 1000 * 2;
const createToken = (email: string, userId: string) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY!, { expiresIn: tokenExpiration });
};

export const currentUser = async (req: Request, res: Response): Promise<void> => {
  let response = null;
  if (req.currentUser) {
    response = { id: req.currentUser.userId, email: req.currentUser.email };
  }
  res.send({ currentUser: response });
};

export const signin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('Wrong email', 'email');
    }

    const passwordsMatch = await PasswordManager.compare(user.password, password);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    res.cookie('jwt', createToken(email, user.id), {
      maxAge: tokenExpiration,
      secure: process.env.NODE_ENV !== 'test',
      httpOnly: true,
      sameSite: 'none',
    });

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const signout = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
    secure: process.env.NODE_ENV !== 'test',
    httpOnly: true,
    sameSite: 'none',
    domain: 'ticketing.dev',
  });
  res.send({});
};

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      throw new BadRequestError('Email in use', 'email');
    }
    const user = User.build({ email, password });

    await user.save();

    res.cookie('jwt', createToken(email, user.id), {
      maxAge: tokenExpiration,
      secure: process.env.NODE_ENV !== 'test',
      httpOnly: true,
      sameSite: 'none',
    });

    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};
