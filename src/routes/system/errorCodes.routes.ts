import { ErrorCodesController } from '../../controllers/system/errorCodes.controller.js';
import { Router } from 'express';

export const router = Router();

const errorCodesController = new ErrorCodesController();

router.get('/', errorCodesController.getErrorCodes.bind(errorCodesController));
