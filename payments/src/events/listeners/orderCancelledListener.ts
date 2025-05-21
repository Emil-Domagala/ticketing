import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@emil_tickets/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import Order from '../../model/orderModel';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
    const { id, version, ticket } = data;

    const order = await Order.findByIdAndPrevVersion({ id, version });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    msg.ack();
  }
}
