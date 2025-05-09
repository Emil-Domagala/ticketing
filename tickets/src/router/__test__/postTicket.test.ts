import request from 'supertest';
import { app } from '../../app';
import Ticket from '../../model/ticketModel';
import { natsClient } from '../../natsClient';

it('Can NOT be accesed if user is NOT signin', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(401);
});

it('Returns status other than 401 if user is signin', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({});
  expect(response.status).not.toEqual(401);
});
it('Returns error if invalid title is provided', async () => {
  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title: 'L', price: 20 }).expect(400);
  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ price: 20 }).expect(400);
});
it('Returns error if invalid price is provided', async () => {
  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title: 'Correct Title', price: 'ii' }).expect(400);

  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title: 'Correct Title', price: -20 }).expect(400);

  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title: 'Correct Title' }).expect(400);
});
it('creates a ticket with valid inputs', async () => {
  //TODO Add check to see if ticket was saved
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'Correct Title';
  const price = 20;

  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price }).expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});

it('publishes an event', async () => {
  await request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title: 'Correct Title', price: 20 }).expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
