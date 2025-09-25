import { Router } from 'express';
import usersRouter from './users';
import productsRouter from './products';
import ordersRouter from './orders';

const router = Router();

router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);

export default router;
