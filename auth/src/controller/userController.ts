import type { Request, Response, NextFunction } from 'express';
import User from '../model/user';
import { BadRequestError } from '../errors/badRequestError';
import { PasswordManager } from '../services/passwordManager';
import jwt from 'jsonwebtoken';

export const createToken = (email: string, id: string) => {
  return jwt.sign({ email, id }, process.env.JWT_KEY!);
};

export const currentUser = async (req: Request, res: Response): Promise<void> => {
  console.log('Hitted curr user');
  // console.log(req);
  res.send({ currentUser: req.currentUser || null });
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
    const userJwt = createToken(user.email, user.id);
    console.log('userJwt: ' + userJwt);
    req.session = { jwt: userJwt };
    console.log('Signin req.session' + req.session);

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
      throw new BadRequestError('Email in use', 'email');
    }
    const user = User.build({ email, password });

    await user.save();

    const userJwt = createToken(user.email, user.id);
    console.log('userJwt: ' + userJwt);
    req.session = { jwt: userJwt };
    console.log('Signup req.session' + req.session);

    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};
