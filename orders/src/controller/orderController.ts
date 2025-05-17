import { BadRequestError, NotFoundError } from '@emil_tickets/common';
import type { Request, Response, NextFunction } from 'express';
import Ticket from '../model/ticketModel';
import Order, { OrderStatus } from '../model/orderModel';

const EXPIRES_AFTER_MILS = 15 * 60 * 1000;

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  res.send({});
};
export const getOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  res.send({});
};
export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { ticketId } = req.body;
  const { userId } = req.currentUser!;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const order = Order.build({ userId, status: OrderStatus.Created, expiresAt: new Date(Date.now() + EXPIRES_AFTER_MILS), ticket });

    await order.save();

    res.send({});
  } catch (err) {
    next(err);
  }
};
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  res.send({});
};
