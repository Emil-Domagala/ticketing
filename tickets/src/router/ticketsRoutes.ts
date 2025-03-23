import { Router } from 'express';
import * as userController from '../controller/ticketsController';
import { validateTicket } from '../middleware/validateTickets';
import { currentUser, requireAuth } from '@emil_tickets/common';
import { checkIfErrorsFromValidator } from '@emil_tickets/common';

const ticketsRoutes = Router();

ticketsRoutes.get('/', currentUser, userController.getTickets);
ticketsRoutes.get('/:id', userController.getTicket);
ticketsRoutes.post(
  '/',
  validateTicket,
  checkIfErrorsFromValidator,
  currentUser,
  requireAuth,
  userController.postTicket,
);
ticketsRoutes.put(
  '/',
  validateTicket,
  checkIfErrorsFromValidator,
  currentUser,
  requireAuth,
  userController.updateTicket,
);

export default ticketsRoutes;
