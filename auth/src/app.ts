import express from 'express';
import userRoutes from './router/userRoutes';
import cookieParser from 'cookie-parser';
import { errorHandler } from '@emil_tickets/common';
import { NotFoundError } from '@emil_tickets/common';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);

app.all('*', async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
