import { body } from 'express-validator';

export const validateSignup = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').isLength({ min: 4, max: 20 }).withMessage('Password must be beetwen 4 and 20 characters'),
];
