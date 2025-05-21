import { Listener, OrderCreatedEvent, Subjects } from '@emil_tickets/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import Order from '../../model/orderModel';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const { id, status, userId, version, ticket } = data;

    const order = Order.build({
      id,
      price: ticket.price,
      status,
      userId,
      version,
    });

    await order.save();

    msg.ack();
  }
}
