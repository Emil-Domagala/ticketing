import express from 'express';
import userRoutes from './router/userRoutes';
import cookieSession from 'cookie-session';
import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './errors/notFoundError';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
    httpOnly: true,
  }),
);

app.use('/api/users', userRoutes);

app.all('*', async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
