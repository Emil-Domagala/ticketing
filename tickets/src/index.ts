import { app } from './app';
import mongoose from 'mongoose';
import { natsClient } from './natsClient';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await natsClient.connect('ticketing', 'abc', 'http://nats-srv:4222');

    natsClient.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsClient.client.close());
    process.on('SIGTERM', () => natsClient.client.close());

    await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log(`Listening on port 3000!!`);
  });
};

start();
