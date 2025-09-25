import supertest from 'supertest';
import app from '../src/server';

const request = supertest(app);

const user = {
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  password: 'secret123'
};

describe('Users endpoints', () => {
  let token: string = '';

  it('POST /users should create a user and return token', async () => {
    const res = await request.post('/users').send(user);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('GET /users should require auth and return list', async () => {
    const res = await request.get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
  });
});
