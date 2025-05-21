import { Listener, OrderCreatedEvent, Subjects } from '@emil_tickets/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expirationQueue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: new Date(data.expiresAt).getTime() - new Date().getTime(),
      },
    );
    msg.ack();
  }
}
