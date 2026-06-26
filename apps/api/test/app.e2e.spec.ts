import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { AuthSession, Inspection } from '@scandiag/contracts';
import { createApp } from '../src/bootstrap';

describe('API FACOM simulée (e2e)', () => {
  let app: INestApplication;
  let http: ReturnType<typeof request>;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
    http = request(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close();
  });

  async function login(): Promise<string> {
    const response = await http
      .post('/api/auth/login')
      .send({ email: 'demo@facom.test', password: 'demo' })
      .expect(201);
    return (response.body as AuthSession).token;
  }

  it('répond sur /api/health', async () => {
    const response = await http.get('/api/health').expect(200);
    expect(response.body).toEqual({ status: 'ok', mode: 'simulation' });
  });

  it('refuse des identifiants invalides (401)', async () => {
    await http
      .post('/api/auth/login')
      .send({ email: 'demo@facom.test', password: 'mauvais' })
      .expect(401);
  });

  it('refuse une entrée non conforme (400)', async () => {
    await http
      .post('/api/auth/login')
      .send({ email: 'pas-un-email', password: '' })
      .expect(400);
  });

  it('protège la liste des véhicules (401 sans jeton)', async () => {
    await http.get('/api/vehicles').expect(401);
  });

  it('déroule le parcours nominal complet', async () => {
    const token = await login();
    const auth = `Bearer ${token}`;

    const vehicles = await http
      .get('/api/vehicles')
      .set('Authorization', auth)
      .expect(200);
    expect(vehicles.body.length).toBeGreaterThan(0);

    const created = await http
      .post('/api/inspections')
      .set('Authorization', auth)
      .send({ vehicleId: 'veh-001' })
      .expect(201);
    const inspectionId = (created.body as Inspection).id;

    const withMeasurement = await http
      .post(`/api/inspections/${inspectionId}/measurements`)
      .set('Authorization', auth)
      .send({
        id: 'm-1',
        type: 'tire',
        position: 'front-left',
        value: 2.4,
        unit: 'mm',
        threshold: 1.6,
        status: 'warning',
        quality: 'good',
        measuredAt: '2026-06-26T10:00:00.000Z',
        source: 'simulation',
      })
      .expect(201);
    expect((withMeasurement.body as Inspection).measurements).toHaveLength(1);

    const completed = await http
      .post(`/api/inspections/${inspectionId}/complete`)
      .set('Authorization', auth)
      .expect(201);
    expect((completed.body as Inspection).status).toBe('completed');

    const history = await http
      .get('/api/vehicles/veh-001/inspections')
      .set('Authorization', auth)
      .expect(200);
    expect(history.body.length).toBeGreaterThan(0);
  });

  it('applique le scénario « API indisponible » (503)', async () => {
    const token = await login();
    await http
      .get('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .set('x-demo-scenario', 'api-unavailable')
      .expect(503);
  });

  it('applique le scénario « sauvegarde refusée » (422)', async () => {
    const token = await login();
    await http
      .post('/api/inspections')
      .set('Authorization', `Bearer ${token}`)
      .set('x-demo-scenario', 'save-rejected')
      .send({ vehicleId: 'veh-001' })
      .expect(422);
  });
});
