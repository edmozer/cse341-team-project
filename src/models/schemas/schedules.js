import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, min: 1 },
    tripId: { type: String, required: true, trim: true },
    departureTime: { type: String, required: true, trim: true },
    arrivalTime: { type: String, required: true, trim: true },
    daysOfWeek: [{ type: String, required: true, trim: true }],
    status: { type: Boolean, required: true, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
