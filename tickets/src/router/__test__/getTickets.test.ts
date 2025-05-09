it('creates a ticket with valid inputs', async () => {});
import request from 'supertest';
import { app } from '../../app';
import Ticket from '../../model/ticketModel';
import mongoose from 'mongoose';


const createTicket = () => {
  const title = 'Correct Title';
  const price = 20;
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({ title, price });
};

it('returns list of tickets', async () => {
  await Promise.all([createTicket(), createTicket()]);

  const response = await request(app).get(`/api/tickets`).send().expect(200);

  expect(response.body.length).toEqual(2);
});
