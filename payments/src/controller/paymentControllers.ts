import type { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, UnauthorizedError } from '@emil_tickets/common';
import { natsClient } from '../natsClient';
import Order from '../model/orderModel';
import { stripe } from '../stripe';
import Payment from '../model/paymentModel';
import { PaymentCreatedPublisher } from '../events/publishers/paymentCreatedPublisher';

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

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
    const payment = Payment.build({ stripeId: charge.id, orderId });

    order.status = OrderStatus.Complete;

    const [paymentResult, orderResult] = await Promise.all([payment.save(), order.save()]);

    await new PaymentCreatedPublisher(natsClient.client).publish({
      id: paymentResult.id,
      orderId: paymentResult.orderId,
      stripeId: paymentResult.stripeId,
    });

    res.status(201).send(paymentResult);
  } catch (err) {
    next(err);
  }
};
