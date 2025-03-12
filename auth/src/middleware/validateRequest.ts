import { body } from 'express-validator';

export const validateSignup = [
  body('email').isEmail().withMessage('Email Must Be Valid'),
  body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be beetwen 4 and 20 characters'),
];
