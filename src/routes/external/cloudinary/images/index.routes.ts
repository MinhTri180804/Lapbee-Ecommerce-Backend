import { Router } from 'express';
import { router as productsRouter } from './products.routes.js';

export const router = Router();

router.use('/products', productsRouter);
