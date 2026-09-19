import Schedule from './schemas/schedules.js';

export function getScheduleById(id) {
  return Schedule.findOne({ id }).lean();
}

export function getSchedulesByTripId(tripId) {
  return Schedule.find({ tripId, status: true }).lean();
}
