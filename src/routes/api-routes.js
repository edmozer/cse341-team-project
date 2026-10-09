import { Router } from 'express';
import { getBooking } from '../controllers/bookings.js';
import { getSchedule, getSchedules } from '../controllers/schedules.js';
import { getTrip, getTrips } from '../controllers/trips.js';
import { getTrainById } from '../controllers/trains.js';
import { trainsApi } from './trains.js';
import { apiAdminDashboard, apiLogin, apiLogout, apiRegister, currentUser } from '../controllers/auth.js';
import { requireApiAdmin, requireApiAuthentication } from '../middleware/auth.js';

const router = Router();

router.post('/auth/register', apiRegister);
router.post('/auth/login', apiLogin);
router.post('/auth/logout', apiLogout);
router.get('/auth/me', requireApiAuthentication, currentUser);
router.get('/admin/dashboard', requireApiAdmin, apiAdminDashboard);

/**
 * @openapi
 * /api/trips:
 *   get:
 *     summary: List trips and available filters
 *     parameters:
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *         description: Filter trips by region.
 *       - in: query
 *         name: season
 *         schema: { type: string }
 *         description: Filter trips by best season.
 *     responses:
 *       200:
 *         description: Trips and filter values returned.
 *       500:
 *         description: Trips could not be loaded.
 */
router.get('/trips', getTrips);

/**
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     summary: Get a trip and its schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip and schedules returned.
 *       404:
 *         description: Trip not found.
 *       500:
 *         description: Trip could not be loaded.
 */
router.get('/trips/:id', getTrip);

router.get('/trains', trainsApi);
router.get('/trains/:id', getTrainById);
router.get('/schedules', getSchedules);
router.get('/schedules/:scheduleId', getSchedule);
router.get('/bookings/:confirmationId', getBooking);

export default router;
