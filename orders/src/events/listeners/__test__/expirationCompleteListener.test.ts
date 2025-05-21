import mongoose from 'mongoose';
import Ticket from '../../../model/ticketModel';
import { ExpirationCompleteListener } from '../expirationCompleteListener';
import Order, { OrderStatus } from '../../../model/orderModel';
import { natsClient } from '../../../natsClient';
import { ExpirationCompleteEvent } from '@emil_tickets/common';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsClient.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg, ticket, order, data };
};

it('cancels order on expiration', async () => {
  const { order, listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { order, listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsClient.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
