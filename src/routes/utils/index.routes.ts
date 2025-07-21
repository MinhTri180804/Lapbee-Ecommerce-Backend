import { Router } from 'express';
import { UtilsController } from '../../controllers/utils/utils.controller.js';

export const router = Router();

const utilsController = new UtilsController();

router.get('/image-size-from-url', utilsController.imageSizeFromUrl.bind(utilsController));
