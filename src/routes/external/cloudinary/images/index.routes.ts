import { Router } from 'express';
import { router as productsRouter } from './products.routes.js';
import { router as brandsRouter } from './brands.routes.js';

export const router = Router();

router.use('/products', productsRouter);
router.use('/brands', brandsRouter);
