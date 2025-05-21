import { ExpirationCompleteEvent, Publisher, Subjects } from '@emil_tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: ExpirationCompleteEvent['subject'] = Subjects.ExpirationComplete;
  
}
