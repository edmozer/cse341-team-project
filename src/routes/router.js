import railTripsRouter from './trips.js';
import { trainsApi, trainsPage } from './trains.js';
import { getBooking } from '../controllers/bookings.js';
import { getSchedule, getSchedules } from '../controllers/schedules.js';
import { getTrip, getTrips } from '../controllers/trips.js';
import { getTrainById } from '../controllers/trains.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Trains API
router.get('/api/trains', trainsApi);
router.get('/api/trains/:id', getTrainById);

// Trips, schedules, and bookings APIs
router.get('/api/trips', getTrips);
router.get('/api/trips/:tripId', getTrip);
router.get('/api/schedules', getSchedules);
router.get('/api/schedules/:scheduleId', getSchedule);
router.get('/api/bookings/:confirmationId', getBooking);

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;
