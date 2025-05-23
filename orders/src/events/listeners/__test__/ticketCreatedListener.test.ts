import { TicketCreatedEvent } from '@emil_tickets/common';
import { natsClient } from '../../../natsClient';
import { TicketCreatedListener } from '../ticketCreatedListener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../model/ticketModel';

const setup = async () => {
  const listener = new TicketCreatedListener(natsClient.client);

  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
