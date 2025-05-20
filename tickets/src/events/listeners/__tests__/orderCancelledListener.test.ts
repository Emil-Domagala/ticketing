import { Message } from 'node-nats-streaming';
import Ticket from '../../../model/ticketModel';
import { natsClient } from '../../../natsClient';
import { OrderCancelledEvent } from '@emil_tickets/common';
import mongoose from 'mongoose';
import { OrderCancelledListener } from '../orderCancelledListener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsClient.client);
  const ticket = Ticket.build({ title: 'concert', price: 99, userId: 'userId' });
  ticket.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    ticket: {
      id: ticket.id,
    },
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it('sets the orderId to undefined', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(undefined);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsClient.client.publish).toHaveBeenCalled();
  const ticketUpdatedData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[0][1]);

  expect(undefined).toEqual(ticketUpdatedData.orderId);
});
