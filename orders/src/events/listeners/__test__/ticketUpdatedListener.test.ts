import { TicketUpdatedEvent } from '@emil_tickets/common';
import { natsClient } from '../../../natsClient';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../model/ticketModel';
import { TicketUpdatedListener } from '../ticketUpdatedListener';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsClient.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticketUpdated = await Ticket.findById(ticket.id);

  expect(ticketUpdated!.title).toEqual(data.title);
  expect(ticketUpdated!.price).toEqual(data.price);
  expect(ticketUpdated!.version).toEqual(data.version);
});
it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup();
  data.version = 10;

  expect(async () => await listener.onMessage(data, msg)).rejects.toThrow();

  expect(msg.ack).not.toHaveBeenCalled();
});
