import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { getDb } from '../src/db/connect.js';

describe('Trips and schedules APIs', () => {
  test('returns trips and filter values', async () => {
    const response = await request(app).get('/api/trips');

    expect(response.status).toBe(200);
    expect(response.body.trips).toHaveLength(6);
    expect(response.body.regions).toContain('central');
    expect(response.body.seasons).toContain('autumn');
  });

  test('filters trips by region and season', async () => {
    const response = await request(app).get('/api/trips?region=central&season=autumn');

    expect(response.status).toBe(200);
    expect(response.body.trips).toHaveLength(2);
    expect(response.body.trips.every((trip) => trip.region === 'central' && trip.bestSeason === 'autumn')).toBe(true);
  });

  test('returns a trip with active schedules', async () => {
    const response = await request(app).get('/api/trips/coastal-breeze');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Coastal Breeze Line');
    expect(response.body.schedules).toHaveLength(1);
    expect(response.body.schedules[0].id).toBe(3);
  });

  test('returns 404 for an unknown trip or schedule', async () => {
    const [tripResponse, scheduleResponse] = await Promise.all([
      request(app).get('/api/trips/unknown-trip'),
      request(app).get('/api/schedules/99')
    ]);

    expect(tripResponse.status).toBe(404);
    expect(scheduleResponse.status).toBe(404);
  });
});

describe('Bookings', () => {
  test('creates a validated booking and exposes it through the API', async () => {
    const bookingResponse = await request(app)
      .post('/trips/book')
      .type('form')
      .send({
        scheduleId: '1',
        tripId: 'alpine-panorama',
        ticketClass: 'standard',
        selectedDay: 'monday',
        passengers: [{ firstName: 'Mina', lastName: 'Ito', email: 'mina@example.com', phone: '+81 120-123-4567' }]
      });

    expect(bookingResponse.status).toBe(302);
    const confirmationId = bookingResponse.headers.location.split('/').pop();
    const response = await request(app).get(`/api/bookings/${confirmationId}`);

    expect(response.status).toBe(200);
    expect(response.body.scheduleId).toBe(1);
    expect(response.body.passengers).toHaveLength(1);
    expect(await getDb().collection('confirmations').countDocuments({ id: confirmationId })).toBe(1);
  });

  test('rejects an invalid booking', async () => {
    const response = await request(app).post('/trips/book').type('form').send({ tripId: 'alpine-panorama' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid booking details');
  });

  test('rejects a booking with an invalid schedule or travel day', async () => {
    const response = await request(app)
      .post('/trips/book')
      .type('form')
      .send({
        scheduleId: '1',
        tripId: 'coastal-breeze',
        ticketClass: 'standard',
        selectedDay: 'sunday',
        passengers: [{ firstName: 'Mina', lastName: 'Ito', email: 'mina@example.com', phone: '+81 120-123-4567' }]
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid booking details');
  });
});
