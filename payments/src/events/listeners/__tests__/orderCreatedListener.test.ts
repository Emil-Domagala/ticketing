import { Message } from 'node-nats-streaming';
import { natsClient } from '../../../natsClient';
import { OrderCreatedListener } from '../orderCreatedListener';
import { OrderCreatedEvent, OrderStatus } from '@emil_tickets/common';
import mongoose from 'mongoose';
import Order from '../../../model/orderModel';

const setup = async () => {
  const listener = new OrderCreatedListener(natsClient.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
    },
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order=await Order.findById(data.id);
  expect(order).toBeDefined();

});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});


