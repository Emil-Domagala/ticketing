import { Listener, OrderCreatedEvent, Subjects } from '@emil_tickets/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import Ticket from '../../model/ticketModel';
import { TicketUpdatedPublisher } from '../publishers/ticketUpdatedPublisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
    const { id, ticket } = data;

    const foundTicket = await Ticket.findById(ticket.id);

    if (!foundTicket) {
      throw new Error('Ticket not found');
    }
    foundTicket.set({ orderId: id });
    await foundTicket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: foundTicket.id,
      title: foundTicket.title,
      price: foundTicket.price,
      userId: foundTicket.userId,
      version: foundTicket.version,
      orderId: foundTicket.orderId,
    });

    msg.ack();
  }
}
