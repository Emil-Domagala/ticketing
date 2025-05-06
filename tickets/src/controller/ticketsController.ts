import type { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError, UnauthorizedError } from '@emil_tickets/common';
import Ticket from '../model/ticketModel';
import { TicketCreatedPublisher } from '../events/publishers/ticketCreatedPublisher';
import { natsClient } from '../natsClient';

export const getTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tickets = await Ticket.find({});
    if (!tickets) {
      throw new NotFoundError();
    }

    res.send(tickets);
  } catch (err) {
    next(err);
  }
};

export const getTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  } catch (err) {
    next(err);
  }
};

export const postTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.userId });

    const savedTicket = await ticket.save();
    new TicketCreatedPublisher(natsClient.client).publish({
      id: savedTicket.id,
      title: savedTicket.title,
      price: savedTicket.price,
      userId: savedTicket.userId,
    });
    res.status(201).send(savedTicket);
  } catch (err) {
    next(err);
  }
};
export const updateTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId.toString() !== req.currentUser!.userId.toString()) {
      throw new UnauthorizedError();
    }
    ticket.set({ title, price });
    await ticket.save();
    res.send(ticket);
  } catch (err) {
    next(err);
  }
};
