import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('authentication pages', () => {
  test('registers a regular user, logs in, and logs out', async () => {
    const agent = request.agent(app);

    const registration = await agent.post('/register').type('form').send({
      name: 'Mina Ito',
      email: 'mina@example.com',
      password: 'SecurePass123!'
    });

    expect(registration.status).toBe(302);
    expect(registration.headers.location).toBe('/login?registered=1');

    const login = await agent.post('/login').type('form').send({
      email: 'mina@example.com',
      password: 'SecurePass123!'
    });

    expect(login.status).toBe(302);
    expect(login.headers.location).toBe('/');

    const forbidden = await agent.get('/admin/dashboard');
    expect(forbidden.status).toBe(403);

    const logout = await agent.post('/logout');
    expect(logout.status).toBe(302);
    expect(logout.headers.location).toBe('/');
  });

  test('allows the seeded administrator to view the dashboard', async () => {
    const agent = request.agent(app);

    const login = await agent.post('/login').type('form').send({
      email: 'admin@kizuna-rail.test',
      password: 'AdminPass123!'
    });

    expect(login.status).toBe(302);
    expect(login.headers.location).toBe('/admin/dashboard');

    const dashboard = await agent.get('/admin/dashboard');
    expect(dashboard.status).toBe(200);
    expect(dashboard.text).toContain('Kizuna Administrator');
  });
});

describe('authentication API', () => {
  test('returns 401 without a session and 403 for a regular user', async () => {
    const agent = request.agent(app);

    const unauthenticated = await agent.get('/api/admin/dashboard');
    expect(unauthenticated.status).toBe(401);

    const registration = await agent.post('/api/auth/register').send({
      name: 'Ken Sato',
      email: 'ken@example.com',
      password: 'SecurePass123!'
    });
    expect(registration.status).toBe(201);
    expect(registration.body.user.role).toBe('user');

    const login = await agent.post('/api/auth/login').send({
      email: 'ken@example.com',
      password: 'SecurePass123!'
    });
    expect(login.status).toBe(200);

    const currentUser = await agent.get('/api/auth/me');
    expect(currentUser.status).toBe(200);
    expect(currentUser.body.user.email).toBeUndefined();
    expect(currentUser.body.user.role).toBe('user');

    const forbidden = await agent.get('/api/admin/dashboard');
    expect(forbidden.status).toBe(403);

    const logout = await agent.post('/api/auth/logout');
    expect(logout.status).toBe(204);

    const signedOut = await agent.get('/api/auth/me');
    expect(signedOut.status).toBe(401);
  });
});
