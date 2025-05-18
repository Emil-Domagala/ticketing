import { BadRequestError, NotFoundError, UnauthorizedError } from '@emil_tickets/common';
import type { Request, Response, NextFunction } from 'express';
import Ticket from '../model/ticketModel';
import Order, { OrderStatus } from '../model/orderModel';
import { natsClient } from '../natsClient';
import { OrderCancelledPublisher } from '../events/publishers/orderCancelledPublisher';
import { OrderCreatedPublisher } from '../events/publishers/orderCreatedPublisher';

const EXPIRES_AFTER_MILS = 15 * 60 * 1000;

export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.currentUser!;
  try {
    const orders = await Order.find({ userId }).populate('ticket');
    res.send(orders);
  } catch (e) {
    next(e);
  }
};
export const getOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { orderId } = req.params;
  const { userId } = req.currentUser!;
  try {
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError();
    }
    res.send(order);
  } catch (e) {
    next(e);
  }
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

    new OrderCreatedPublisher(natsClient.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  } catch (err) {
    next(err);
  }
};
export const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { orderId } = req.params;
  const { userId } = req.currentUser!;
  try {
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId.toString() !== userId.toString()) {
      throw new UnauthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  } catch (e) {
    next(e);
  }
};
