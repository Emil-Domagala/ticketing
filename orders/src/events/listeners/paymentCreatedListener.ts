import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from '@emil_tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import Order from '../../model/orderModel';
import { OrderCancelledPublisher } from '../publishers/orderCancelledPublisher';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
