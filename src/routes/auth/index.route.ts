import { Router } from 'express';
import { router as localAuthRouter } from './local.route.js';

export const router = Router();

router.use('/local', localAuthRouter);
