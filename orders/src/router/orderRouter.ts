import { Router } from 'express';
import * as orderController from '../controller/orderController';
import { checkIfErrorsFromValidator, currentUser, requireAuth } from '@emil_tickets/common';
import { validateCreateOrder } from '../middleware/validateCreateOrder';

const orderRoutes = Router();

orderRoutes.get('/', currentUser, requireAuth, validateCreateOrder, orderController.getOrders);
orderRoutes.get('/:orderId', currentUser, requireAuth, orderController.getOrder);
orderRoutes.post('/', currentUser, requireAuth, validateCreateOrder, checkIfErrorsFromValidator, orderController.createOrder);
orderRoutes.patch('/:orderId', currentUser, requireAuth, orderController.deleteOrder);

export default orderRoutes;
