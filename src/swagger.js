const openapiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Kizuna Rail API',
    version: '1.0.0',
    description: 'API for scenic train trips, schedules, trains, and bookings.'
  },
  servers: [{ url: '/' }],
  paths: {
    '/api/trips': {
      get: {
        summary: 'List trips and available filters',
        parameters: [
          { name: 'region', in: 'query', schema: { type: 'string' } },
          { name: 'season', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Trips and filter values returned.' },
          500: { description: 'Trips could not be loaded.' }
        }
      }
    },
    '/api/trips/{id}': {
      get: {
        summary: 'Get a trip and its schedules',
        parameters: [{
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }],
        responses: {
          200: { description: 'Trip and schedules returned.' },
          404: { description: 'Trip not found.' },
          500: { description: 'Trip could not be loaded.' }
        }
      }
    },
    '/api/trains': { get: { summary: 'List trains', responses: { 200: { description: 'Trains returned.' } } } },
    '/api/trains/{id}': { get: { summary: 'Get a train', responses: { 200: { description: 'Train returned.' }, 404: { description: 'Train not found.' } } } },
    '/api/schedules': { get: { summary: 'List schedules for a trip', responses: { 200: { description: 'Schedules returned.' } } } },
    '/api/schedules/{scheduleId}': { get: { summary: 'Get a schedule', responses: { 200: { description: 'Schedule returned.' }, 404: { description: 'Schedule not found.' } } } },
    '/api/bookings/{confirmationId}': { get: { summary: 'Get a booking', responses: { 200: { description: 'Booking returned.' }, 404: { description: 'Booking not found.' } } } }
  }
};

export { openapiDocument };
