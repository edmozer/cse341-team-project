import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    scheduleId: { type: Number, required: true, min: 1 },
    tripId: { type: String, required: true, trim: true },
    ticketClass: { type: String, required: true, trim: true },
    selectedDay: { type: String, required: true, trim: true },
    passengers: { type: [passengerSchema], required: true, validate: [(value) => value.length > 0, 'At least one passenger is required.'] }
  },
  { collection: 'confirmations', timestamps: true }
);

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
