import request from 'supertest';
import { app } from '../../app';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { natsClient } from '../../natsClient';

const createTicket = (cookie: string[]) => {
  const title = 'Correct Title';
  const price = 20;
  return request(app).post('/api/tickets').set('Cookie', cookie).send({ title, price }).expect(201);
};

const generateToken = () => {
  const tokenExpiration = 60 * 60 * 1000 * 2;

  const token = jwt.sign({ email: 'test1@test.com', userId: '2' }, process.env.JWT_KEY!, {
    expiresIn: tokenExpiration,
  });

  return [`jwt=${token}`];
};

it('returns 404 if ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(404);
});
it('returns 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(401);
});

it('returns 401 does not own a ticket', async () => {
  const cookie = global.signin();
  const ticket = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(401);
});

it('returns 400 if user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const ticket = await createTicket(cookie);
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'L',
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Fine Title',
      price: -20,
    })
    .expect(400);
});
it('updates the ticket if provided valid inputs', async () => {
  const newTitle = 'New Title';
  const newPrice = 100;
  const cookie = global.signin();

  const ticket = await createTicket(cookie);
  const updatedTicket = await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);
  expect(updatedTicket.body.title).toEqual(newTitle);
  expect(updatedTicket.body.price).toEqual(newPrice);
});
it('publishes an event', async () => {
  const newTitle = 'New Title';
  const newPrice = 100;
  const cookie = global.signin();

  const ticket = await createTicket(cookie);
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
