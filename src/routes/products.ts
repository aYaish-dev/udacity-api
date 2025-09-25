import { Router, Request, Response } from 'express';
import verifyAuthToken from '../middleware/verifyAuthToken';
import { ProductModel } from '../models/product';

const router = Router();
const model = new ProductModel();

// GET /products → public
router.get('/', async (_req: Request, res: Response) => {
  const products = await model.index();
  res.json(products);
});

// GET /products/:id → public
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const product = await model.show(id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// POST /products → protected (JWT)
router.post('/', verifyAuthToken, async (req: Request, res: Response) => {
  const { name, price, category } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const product = await model.create({ name, price, category });
  res.status(201).json(product);
});

export default router;
