import supertest from 'supertest';
import app from '../src/server';

const request = supertest(app);

describe('Health endpoint', () => {
  it('GET /health should be ok', async () => {
    const res = await request.get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBeTrue();
  });
});
