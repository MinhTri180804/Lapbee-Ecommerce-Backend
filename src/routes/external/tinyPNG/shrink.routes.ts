import { validateRequestBody } from './../../../middleware/validateRequestBody.middleware.js';
import { Router } from 'express';
import { CompressingImageTinyPNGController } from '../../../controllers/external/tinyPNG/CompressingImage.controller.js';
import {
  compressingImageFromUrlDTO,
  CompressingImageFromUrlDTO
} from '../../../dto/request/external/tinyPNG/compressingImage/fromURL.dto.js';

export const router = Router();

const compressingImageTinyPNGController = new CompressingImageTinyPNGController();

const validateRequestBodyShrinkFromURL = validateRequestBody<CompressingImageFromUrlDTO>(compressingImageFromUrlDTO);

router.post(
  '/from-url',
  validateRequestBodyShrinkFromURL,
  compressingImageTinyPNGController.fromURL.bind(compressingImageTinyPNGController)
);
