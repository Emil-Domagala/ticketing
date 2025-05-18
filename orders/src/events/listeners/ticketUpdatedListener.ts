import { Listener, Subjects, TicketUpdatedEvent } from '@emil_tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import Ticket from '../../model/ticketModel';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    const { id, title, price, version } = data;
    const ticket = await Ticket.findByIdAndPrevVersion(data);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
