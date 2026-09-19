import Trip from './schemas/trips.js';

export function getAllTrips(filters = {}) {
  return Trip.find(filters).lean();
}

export function getTripById(id) {
  return Trip.findOne({ id }).lean();
}

export function getTripFilters() {
  return Promise.all([Trip.distinct('region'), Trip.distinct('bestSeason')]);
}
