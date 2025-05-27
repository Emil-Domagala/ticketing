import type { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, UnauthorizedError } from '@emil_tickets/common';
import { natsClient } from '../natsClient';
import Order from '../model/orderModel';

export const createCharge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { token, orderId } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.userId) {
      throw new UnauthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for an cancelled order');
    }

    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};
