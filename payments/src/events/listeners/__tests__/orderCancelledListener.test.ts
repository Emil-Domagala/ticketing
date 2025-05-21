import { Message } from 'node-nats-streaming';
import { natsClient } from '../../../natsClient';
import { OrderCancelledListener } from '../orderCancelledListener';
import { OrderCancelledEvent, OrderStatus } from '@emil_tickets/common';
import mongoose from 'mongoose';
import Order from '../../../model/orderModel';

const setup = async () => {
  const listener = new OrderCancelledListener(natsClient.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  //   @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, order, data, msg };
};

it('changes the order status', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const order = await Order.findById(data.id);
  expect(order).toBeDefined();
  expect(order!.id).toEqual(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
