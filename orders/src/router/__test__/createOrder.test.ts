import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import Order, { OrderStatus } from '../../model/orderModel';
import Ticket from '../../model/ticketModel';
import { natsClient } from '../../natsClient';

it('Can not be accessed if user is NOT signin', async () => {
  const res = await request(app).post('/api/orders').send({});
  expect(res.status).toEqual(401);
});

it('Returns status other than 401 if user is signin', async () => {
  const res = await request(app).post('/api/orders').set('Cookie', global.signin()).send({});
  expect(res.status).not.toEqual(401);
});
it('returns error if no ticket found', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const res = await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId: ticketId });
  expect(res.status).toEqual(404);
});
it('returns error if ticket is already reserved', async () => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 });
  await ticket.save();
  const order = Order.build({ ticket, userId: new mongoose.Types.ObjectId().toHexString(), status: OrderStatus.Created, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
  await order.save();

  const res = await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId: ticket.id });
  expect(res.status).toEqual(400);
});
it('reserve a ticket and emits an order created event', async () => {
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 });
  await ticket.save();

  const res = await request(app).post('/api/orders').set('Cookie', global.signin()).send({ ticketId: ticket.id });
  expect(res.status).toEqual(201);
  expect(natsClient.client.publish).toHaveBeenCalled();
});
