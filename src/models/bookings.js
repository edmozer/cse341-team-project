import Booking from './schemas/bookings.js';

export function createBooking(booking) {
  return Booking.create(booking);
}

export function getBookingById(id) {
  return Booking.findOne({ id }).lean();
}
