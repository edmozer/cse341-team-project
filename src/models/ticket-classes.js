import TicketClass from './schemas/ticket-classes.js';

export function getAllTicketClasses() {
  return TicketClass.find({}).lean();
}

export function getTicketClassByClass(ticketClass) {
  return TicketClass.findOne({ class: ticketClass }).lean();
}
