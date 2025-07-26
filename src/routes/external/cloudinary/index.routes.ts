import { Router } from 'express';
import { router as imagesRouter } from './images/index.routes.js';
import { router as foldersRouter } from './folders/index.routes.js';
import { router as filesRouter } from './files/index.routes.js';

export const router = Router();

router.use('/images', imagesRouter);
router.use('/folders', foldersRouter);
router.use('/files', filesRouter);
