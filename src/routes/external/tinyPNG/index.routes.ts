import { router as shrinkRouter } from './shrink.routes.js';
import { Router } from 'express';

export const router = Router();

router.use('/shrink', shrinkRouter);
