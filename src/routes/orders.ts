import { Router, Request, Response } from 'express';
import verifyAuthToken from '../middleware/verifyAuthToken';
import { OrderModel } from '../models/order';

const router = Router();
const model = new OrderModel();

// POST /orders  (محمي)  body: { user_id, status: 'active' | 'complete' }
router.post('/', verifyAuthToken, async (req: Request, res: Response) => {
  const { user_id, status } = req.body;
  if (!user_id || !status) return res.status(400).json({ error: 'Missing user_id or status' });

  try {
    const order = await model.create({ user_id: Number(user_id), status });
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /orders/:id/products  (محمي)  body: { product_id, quantity }
router.post('/:id/products', verifyAuthToken, async (req: Request, res: Response) => {
  const order_id = Number(req.params.id);
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) return res.status(400).json({ error: 'Missing product_id or quantity' });

  try {
    const item = await model.addProduct({ order_id, product_id: Number(product_id), quantity: Number(quantity) });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /orders/:user_id/current  (محمي)
router.get('/:user_id/current', verifyAuthToken, async (req: Request, res: Response) => {
  const user_id = Number(req.params.user_id);
  try {
    const data = await model.currentByUser(user_id);
    if (!data) return res.status(404).json({ error: 'No active order' });
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
