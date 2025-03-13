import express from 'express';
import userRoutes from './router/userRoutes.ts';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { errorHandler } from './middleware/errorHandler.ts';
import { NotFoundError } from './errors/notFoundError.ts';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    httpOnly: true,
  }),
);

app.use('/api/users', userRoutes);

app.all('*', async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log(`Listening on port 3000!!`);
  });
};

start();
