import { Router } from 'express';
import { router as errorCodesRouter } from './errorCodes.routes.js';

export const router = Router();

router.use('/error-codes', errorCodesRouter);
