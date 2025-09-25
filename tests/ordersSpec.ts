import supertest from 'supertest';
import app from '../src/server';

const request = supertest(app);

describe('Orders endpoints', () => {
  let token = '';
  let userId = 0;
  let productId = 0;
  let orderId = 0;

  beforeAll(async () => {
    // 1) أنشئ مستخدم وخُذ توكن
    const u = await request.post('/users').send({
      first_name: 'O',
      last_name: 'Tester',
      email: `o_${Date.now()}@example.com`,
      password: 'secret123'
    });
    token = u.body.token;

    // استخرج user_id من التوكن إذا لزم؟ نسهّلها بإنشاء مستخدم آخر وفحص /users (محمي) وإيجاد آخر id
    // لكن بما أن show/index تتطلب JWT، نجيب القائمة ونأخذ أكبر id
    const usersRes = await request
      .get('/users')
      .set('Authorization', `Bearer ${token}`);
    userId = usersRes.body[usersRes.body.length - 1].id;

    // 2) أنشئ product
    const p = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Table', price: 150, category: 'furniture' });
    productId = p.body.id;
  });

  it('POST /orders should create an order (active)', async () => {
    const res = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: userId, status: 'active' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('active');
    orderId = res.body.id;
  });

  it('POST /orders/:id/products should add product to order', async () => {
    const res = await request
      .post(`/orders/${orderId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: productId, quantity: 3 });

    expect(res.status).toBe(201);
    expect(res.body.order_id).toBe(orderId);
    expect(res.body.product_id).toBe(productId);
    expect(res.body.quantity).toBe(3);
  });

  it('GET /orders/:user_id/current should return current active order with items', async () => {
    const res = await request
      .get(`/orders/${userId}/current`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.order.id).toBe(orderId);
    expect(Array.isArray(res.body.items)).toBeTrue();
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.items[0].name).toBeDefined();
  });
});
