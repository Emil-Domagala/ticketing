import type { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError, UnauthorizedError } from '@emil_tickets/common';
import { natsClient } from '../natsClient';

export const createCharge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

  } catch (err) {
    next(err);
  }
};
