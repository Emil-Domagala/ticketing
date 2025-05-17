import express from 'express';
import orderRoutes from './router/orderRouter';
import cookieParser from 'cookie-parser';
import { currentUser, errorHandler, NotFoundError } from '@emil_tickets/common';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());
app.use(currentUser);

app.use('/api/orders', orderRoutes);

app.all('*', async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
