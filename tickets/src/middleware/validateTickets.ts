import { body } from 'express-validator';

export const validateTicket = [
  body('title').trim().isLength({ min: 4, max: 40 }).withMessage('Title must be between 4 and 40 characters'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];
