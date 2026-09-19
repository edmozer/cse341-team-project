import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    operator: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    imageAlt: { type: String, trim: true },
    type: { type: String, required: true, trim: true },
    maxSpeedKmh: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 0 },
    powerSource: { type: String, required: true, trim: true },
    bestFor: { type: String, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.models.Train || mongoose.model('Train', trainSchema);
