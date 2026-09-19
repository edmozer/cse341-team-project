import { getScheduleById, getSchedulesByTripId } from '../models/schedules.js';

export async function getSchedules(req, res) {
  try {
    const schedules = await getSchedulesByTripId(req.query.tripId);
    return res.status(200).json({ schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({ error: 'Failed to fetch schedules' });
  }
}

export async function getSchedule(req, res) {
  try {
    const schedule = await getScheduleById(Number(req.params.scheduleId));
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    return res.status(200).json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return res.status(500).json({ error: 'Failed to fetch schedule' });
  }
}
