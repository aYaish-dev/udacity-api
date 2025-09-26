import { OrderModel } from '../src/models/order';
import { ProductModel } from '../src/models/product';
import { UserModel } from '../src/models/user';

const orderModel = new OrderModel();
const productModel = new ProductModel();
const userModel = new UserModel();

describe('OrderModel (unit)', () => {
  const userEmail = `unit_order_${Date.now()}@example.com`;
  let userId = 0;
  let productId = 0;
  let orderId = 0;

  beforeAll(async () => {
    await userModel.create({
      first_name: 'Order',
      last_name: 'Tester',
      email: userEmail,
      password: 'secret123'
    } as any);

    const users = await userModel.index();
    const created = users.find((u) => u.email === userEmail);
    if (!created || typeof created.id !== 'number') {
      throw new Error('Failed to locate user after creation');
    }
    userId = created.id;

    const createdProduct = await productModel.create({
      name: `Order Model Product ${Date.now()}`,
      price: 99.99,
      category: 'unit-order'
    });
    productId = createdProduct.id as number;
  });

  it('create() should create an order for the user', async () => {
    const order = await orderModel.create({
      user_id: userId,
      status: 'active'
    });

    expect(order.id).toBeDefined();
    expect(order.user_id).toBe(userId);
    expect(order.status).toBe('active');
    orderId = order.id as number;
  });

  it('addProduct() should attach a product to the order', async () => {
    const orderProduct = await orderModel.addProduct({
      order_id: orderId,
      product_id: productId,
      quantity: 3
    });

    expect(orderProduct.id).toBeDefined();
    expect(orderProduct.order_id).toBe(orderId);
    expect(orderProduct.product_id).toBe(productId);
    expect(orderProduct.quantity).toBe(3);
  });

  it('currentByUser() should return the active order with items', async () => {
    const result = await orderModel.currentByUser(userId);
    expect(result).toBeTruthy();
    expect(result?.order.id).toBe(orderId);
    expect(result?.order.user_id).toBe(userId);
    expect(Array.isArray(result?.items)).toBeTrue();
    expect(result?.items.length).toBeGreaterThan(0);
    const item = result?.items[0];
    expect(item?.product_id).toBe(productId);
    expect(item?.quantity).toBe(3);
  });
});
