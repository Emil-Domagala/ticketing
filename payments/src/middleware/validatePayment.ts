import { body } from 'express-validator';

export const validatePayment = [
  body('token').not().isEmpty().withMessage('Title must be between 4 and 40 characters'),
  body('orderId').not().isEmpty().withMessage('Price must be greater than 0'),
];
