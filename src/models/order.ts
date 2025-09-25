import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: 'active' | 'complete';
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderModel {
  async create(o: Order): Promise<Order> {
    const conn = await client.connect();
    try {
      const sql = `INSERT INTO orders (user_id, status)
                   VALUES ($1, $2) RETURNING *`;
      const result = await conn.query(sql, [o.user_id, o.status]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async addProduct(op: OrderProduct): Promise<OrderProduct> {
    const conn = await client.connect();
    try {
      // تأكد أن الطلب موجود
      const orderRes = await conn.query('SELECT id FROM orders WHERE id=$1', [op.order_id]);
      if (orderRes.rowCount === 0) {
        throw new Error('Order not found');
      }
      // تأكد أن المنتج موجود
      const prodRes = await conn.query('SELECT id FROM products WHERE id=$1', [op.product_id]);
      if (prodRes.rowCount === 0) {
        throw new Error('Product not found');
      }
      const sql = `INSERT INTO order_products (order_id, product_id, quantity)
                   VALUES ($1, $2, $3) RETURNING *`;
      const result = await conn.query(sql, [op.order_id, op.product_id, op.quantity]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async currentByUser(user_id: number) {
    const conn = await client.connect();
    try {
      // آخر طلب active للمستخدم + العناصر بداخله
      const orderSql = `SELECT * FROM orders
                        WHERE user_id=$1 AND status='active'
                        ORDER BY id DESC
                        LIMIT 1`;
      const orderRes = await conn.query(orderSql, [user_id]);
      const order = orderRes.rows[0];
      if (!order) return null;

      const itemsSql = `SELECT op.*, p.name, p.price, p.category
                        FROM order_products op
                        JOIN products p ON p.id = op.product_id
                        WHERE op.order_id=$1
                        ORDER BY op.id`;
      const itemsRes = await conn.query(itemsSql, [order.id]);

      return { order, items: itemsRes.rows };
    } finally {
      conn.release();
    }
  }
}
