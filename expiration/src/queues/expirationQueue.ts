import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expirationCompletePublisher';
import { natsClient } from '../natsClient';

interface Payload {
  orderId: string;
}

export const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
    port: 6379,
  },
});

expirationQueue.process(async (job) => {
  console.log('Publish expiration:complete event for orderId' + job.data.orderId);
  new ExpirationCompletePublisher(natsClient.client).publish({
    orderId: job.data.orderId,
  });
});
