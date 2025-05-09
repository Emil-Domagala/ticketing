import { Publisher, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from '@emil_tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
