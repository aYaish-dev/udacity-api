import supertest from 'supertest';
import app from '../src/server';

const request = supertest(app);

describe('Products endpoints', () => {
  let token = '';
  let productId = 0;

  beforeAll(async () => {
    // أنشئ مستخدم وخُذ توكن
    const u = await request.post('/users').send({
      first_name: 'P',
      last_name: 'Tester',
      email: `p_${Date.now()}@example.com`,
      password: 'secret123'
    });
    token = u.body.token;
  });

  it('POST /products (JWT) should create a product', async () => {
    const res = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Phone', price: 699, category: 'electronics' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Phone');
    productId = res.body.id;
  });

  it('GET /products should list products', async () => {
    const res = await request.get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTrue();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /products/:id should return the product', async () => {
    const res = await request.get(`/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Phone');
  });
});
