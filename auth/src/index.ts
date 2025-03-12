import express from 'express';
import userRoutes from './router/userRoutes.ts';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.ts';
import { NotFoundError } from './errors/notFoundError.ts';

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

app.all('*', async (_req, _res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!!`);
});

mongoose
  .connect('mongodb://auth-mongo-srv:27017/auth')
  .then(() => {
    console.log('DB CONNECTED');
  })
  .catch((err) => console.log(err.message));
