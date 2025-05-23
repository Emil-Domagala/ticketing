import { Router } from 'express';
import * as paymentController from '../controller/paymentControllers';
import { currentUser, requireAuth } from '@emil_tickets/common';
import { checkIfErrorsFromValidator } from '@emil_tickets/common';
import { validatePayment } from '../middleware/validatePayment';

const paymentsRoutes = Router();

paymentsRoutes.post('/', currentUser, requireAuth, validatePayment, checkIfErrorsFromValidator, paymentController.createCharge);

export default paymentsRoutes;
