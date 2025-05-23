import express from 'express';
import cookieParser from 'cookie-parser';
import { currentUser, errorHandler, NotFoundError } from '@emil_tickets/common';
import paymentsRoutes from './router/paymentRoutes';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());
app.use(currentUser);

app.use('/api/payments', paymentsRoutes);

app.all('*', async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
