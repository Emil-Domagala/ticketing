import { Router } from 'express';
import * as ticketsController from '../controller/ticketsController';
import { validateTicket } from '../middleware/validateTickets';
import { currentUser, requireAuth } from '@emil_tickets/common';
import { checkIfErrorsFromValidator } from '@emil_tickets/common';

const ticketsRoutes = Router();

ticketsRoutes.get('/', ticketsController.getTickets);
ticketsRoutes.get('/:id', ticketsController.getTicket);

ticketsRoutes.post('/', currentUser,requireAuth, validateTicket, checkIfErrorsFromValidator, ticketsController.postTicket);

ticketsRoutes.put('/:id', currentUser, requireAuth, validateTicket, checkIfErrorsFromValidator, ticketsController.updateTicket);

export default ticketsRoutes;
