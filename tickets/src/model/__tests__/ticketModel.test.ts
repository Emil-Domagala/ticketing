import mongoose from 'mongoose';
import Ticket from '../ticketModel';

it('implements optimistic concurrency control', async () => {
  const ticket = Ticket.build({ title: 'someTitle', price: 12, userId: 'lol' });
  await ticket.save();
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  await firstInstance!.save();

  expect(async () => secondInstance!.save()).rejects.toThrow();
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({ title: 'someTitle', price: 12, userId: 'lol' });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
