import { Router } from 'express';
import { router as imagesRouter } from './images/index.routes.js';

export const router = Router();

router.use('/images', imagesRouter);
