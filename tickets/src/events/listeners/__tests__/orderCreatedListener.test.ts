import { Message } from 'node-nats-streaming';
import Ticket from '../../../model/ticketModel';
import { natsClient } from '../../../natsClient';
import { OrderCreatedListener } from '../orderCreatedListener';
import { OrderCreatedEvent, OrderStatus } from '@emil_tickets/common';
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new OrderCreatedListener(natsClient.client);
  const ticket = Ticket.build({ title: 'concert', price: 99, userId: 'userId' });

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    version: 1,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
};

it('sets the orderId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
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
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
