import { Stan } from 'node-nats-streaming';
import { Subjects } from './types/subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err: any) => {
        if (err) return reject(err);
        console.log('Event published to:', this.subject);
        resolve();
      });
    });
  }
}
