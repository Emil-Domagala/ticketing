import request from 'supertest';
import { app } from '../../app';
import Ticket from '../../model/ticketModel';

it('Can not be accessed if user is NOT signin', async () => {
  const res = await request(app).get('/api/orders').send({});
  expect(res.status).toEqual(401);
});

it('returns orders for a given user', async () => {
  const ticket1 = Ticket.build({ title: 'concert', price: 20 });
  const ticket2 = Ticket.build({ title: 'concert1', price: 10 });
  const ticket3 = Ticket.build({ title: 'concert2', price: 30 });
  await Promise.all([ticket1.save(), ticket2.save(), ticket3.save()]);
  const userOne = global.signin();
  const userTwo = global.signin();

  const { body: orderUnwanted } = await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: ticket1.id }).expect(201);
  await request(app).post('/api/orders').set('Cookie', userTwo).send({ ticketId: ticket2.id }).expect(201);
  await request(app).post('/api/orders').set('Cookie', userTwo).send({ ticketId: ticket3.id }).expect(201);

  const res = await request(app).get('/api/orders').set('Cookie', userTwo).send({}).expect(200);
  expect(res.body.length).toEqual(2);
  expect(res.body.some((order: any) => order.id === orderUnwanted.id)).toEqual(false);
  expect(res.body.some((order: any) => order.ticket.id === orderUnwanted.ticket.id)).toEqual(false);
});
