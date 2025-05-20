import request from 'supertest';
import { app } from '../../app';
import Ticket from '../../model/ticketModel';
import mongoose from 'mongoose';

it('Can not be accessed if user is NOT signin', async () => {
  const orderId = new mongoose.Types.ObjectId();
  const res = await request(app)
    .get('/api/orders/' + orderId)
    .send({});
  expect(res.status).toEqual(401);
});

it('Can not access others ppl orders', async () => {
  const ticket1 = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 });

  await ticket1.save();
  const userOne = global.signin();
  const userTwo = global.signin();

  const { body: orderUnwanted } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);

  await request(app).get(`/api/orders/${orderUnwanted.id}`).set('Cookie', userTwo).send({}).expect(401);
});
it('Returns order sucessfully', async () => {
  const ticket1 = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), title: 'concert', price: 20 });

  await ticket1.save();
  const userOne = global.signin();
  const { body: order } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);

  await request(app).get(`/api/orders/${order.id}`).set('Cookie', userOne).send({}).expect(200);
});
