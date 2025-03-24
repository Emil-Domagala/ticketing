import { Router } from 'express';
import * as userController from '../controller/ticketsController';
import { validateTicket } from '../middleware/validateTickets';
import { requireAuth } from '@emil_tickets/common';
import { checkIfErrorsFromValidator } from '@emil_tickets/common';

const ticketsRoutes = Router();

ticketsRoutes.get('/', userController.getTickets);
ticketsRoutes.get('/:id', userController.getTicket);

ticketsRoutes.post('/', requireAuth, validateTicket, checkIfErrorsFromValidator, userController.postTicket);

ticketsRoutes.put('/:id', requireAuth, validateTicket, checkIfErrorsFromValidator, userController.updateTicket);

export default ticketsRoutes;
