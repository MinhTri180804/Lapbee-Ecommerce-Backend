import { Router } from 'express';
import { router as imageRouter } from './image.routes.js';

export const router = Router();

router.use('/image', imageRouter);
