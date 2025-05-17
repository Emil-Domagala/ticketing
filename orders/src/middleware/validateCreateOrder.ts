import { body } from 'express-validator';

export const validateCreateOrder = [body('ticketId').not().isEmpty().withMessage('ticketId is required')];
