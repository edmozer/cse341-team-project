import { createBooking, getBookingById } from '../models/bookings.js';
import { getScheduleById } from '../models/schedules.js';
import { getAllTicketClasses, getTicketClassByClass } from '../models/ticket-classes.js';
import { getTripById } from '../models/trips.js';
import { generateConfirmationCode } from '../includes/helpers.js';

export async function bookingPage(req, res, next) {
  try {
    const schedule = await getScheduleById(Number(req.params.scheduleId));
    if (!schedule) return res.status(404).render('errors/404', { title: 'Page Not Found', error: 'Schedule not found' });
    const trip = await getTripById(schedule.tripId);
    const ticketClasses = await getAllTicketClasses();
    const ticketOptions = ticketClasses.map((ticketClass) => ({ ...ticketClass, price: trip.distance * ticketClass.pricePerKm }));
    return res.render('trips/book', { title: 'Book Trip', schedule, ticketOptions });
  } catch (error) {
    return next(error);
  }
}

export async function processBookingRequest(req, res, next) {
  try {
    const scheduleId = Number(req.body.scheduleId);
    if (!Number.isInteger(scheduleId) || scheduleId < 1) {
      return res.status(400).json({ error: 'Invalid booking details' });
    }
    const [schedule, ticketClass] = await Promise.all([
      getScheduleById(scheduleId),
      getTicketClassByClass(req.body.ticketClass)
    ]);
    const hasValidSchedule = schedule
      && schedule.tripId === req.body.tripId
      && schedule.status
      && schedule.daysOfWeek.includes(req.body.selectedDay);
    if (!hasValidSchedule || !ticketClass) {
      return res.status(400).json({ error: 'Invalid booking details' });
    }
    const booking = await createBooking({ id: generateConfirmationCode(), ...req.body });
    return res.redirect(`/trips/confirmation/${booking.id}`);
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ error: 'Invalid booking details' });
    return next(error);
  }
}

export async function confirmationPage(req, res, next) {
  try {
    const confirmation = await getBookingById(req.params.confirmationId);
    if (!confirmation) return res.status(404).render('errors/404', { title: 'Page Not Found', error: 'Booking not found' });
    return res.render('trips/confirm', { title: 'Trip Confirmation', confirmation });
  } catch (error) {
    return next(error);
  }
}

export async function getBooking(req, res) {
  try {
    const booking = await getBookingById(req.params.confirmationId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
}
