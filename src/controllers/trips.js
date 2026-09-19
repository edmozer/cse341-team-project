import { getSchedulesByTripId } from '../models/schedules.js';
import { getAllTrips, getTripById, getTripFilters } from '../models/trips.js';

export function tripsPage(req, res) {
  res.render('trips/list', { title: 'Scenic Train Trips' });
}

export async function getTrips(req, res) {
  try {
    const filters = {};
    if (req.query.region && req.query.region !== 'all') filters.region = req.query.region;
    if (req.query.season && req.query.season !== 'all') filters.bestSeason = req.query.season;
    const [trips, [regions, seasons]] = await Promise.all([getAllTrips(filters), getTripFilters()]);
    return res.status(200).json({ trips, regions, seasons });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return res.status(500).json({ error: 'Failed to fetch trips' });
  }
}

export function tripDetailsPage(req, res) {
  res.render('trips/details', { title: 'Trip Details' });
}

export async function getTrip(req, res) {
  try {
    const trip = await getTripById(req.params.tripId);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    const schedules = await getSchedulesByTripId(trip.id);
    return res.status(200).json({ ...trip, schedules });
  } catch (error) {
    console.error('Error fetching trip:', error);
    return res.status(500).json({ error: 'Failed to fetch trip' });
  }
}
