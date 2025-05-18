import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import Order, { OrderStatus } from '../../model/orderModel';
import Ticket from '../../model/ticketModel';
import { natsClient } from '../../natsClient';

it('Can not be accessed if user is NOT signin', async () => {
  const orderId = new mongoose.Types.ObjectId();
  const res = await request(app)
    .patch('/api/orders/' + orderId)
    .send({});
  expect(res.status).toEqual(401);
});

it('Can not acces others ppl orders', async () => {
  const ticket1 = Ticket.build({id:'a', title: 'concert', price: 20 });

  await ticket1.save();
  const userOne = global.signin();
  const userTwo = global.signin();
  const { body: orderUnwanted } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);

  await request(app).patch(`/api/orders/${orderUnwanted.id}`).set('Cookie', userTwo).send({}).expect(401);
});

it('Sucessfully returns order with new order status and emits an order cancelled event', async () => {
  const ticket1 = Ticket.build({id:'a', title: 'concert', price: 20 });

  await ticket1.save();
  const userOne = global.signin();
  const { body: order } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);

  await request(app).patch(`/api/orders/${order.id}`).set('Cookie', userOne).send().expect(204);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(natsClient.client.publish).toHaveBeenCalled();
});
