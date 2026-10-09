import railTripsRouter from './trips.js';
import { trainsPage } from './trains.js';
import apiRoutes from './api-routes.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';
import { adminDashboard, login, loginPage, logout, register, registerPage } from '../controllers/auth.js';
import { requirePageAdmin } from '../middleware/auth.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Authentication pages
router.get('/register', registerPage);
router.post('/register', register);
router.get('/login', loginPage);
router.post('/login', login);
router.post('/logout', logout);
router.get('/admin/dashboard', requirePageAdmin, adminDashboard);

// JSON APIs
router.use('/api', apiRoutes);

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;
