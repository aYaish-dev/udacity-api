import { Router, Request, Response } from 'express';
import verifyAuthToken from '../middleware/verifyAuthToken';
import { UserModel } from '../models/user';

const router = Router();
const model = new UserModel();

// GET /users (secure)
router.get('/', verifyAuthToken, async (_req: Request, res: Response) => {
  const users = await model.index();
  res.json(users);
});

// GET /users/:id (secure)
router.get('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await model.show(id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// POST /users (public) => creates user and returns JWT
router.post('/', async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const token = await model.create({ first_name, last_name, email, password });
  res.status(201).json({ token });
});

// POST /users/authenticate (public) => returns JWT
router.post('/authenticate', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await model.authenticate(email, password);
  if (!token) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token });
});

export default router;
