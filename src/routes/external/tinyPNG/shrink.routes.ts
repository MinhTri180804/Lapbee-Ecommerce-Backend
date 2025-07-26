import { validateRequestBody } from './../../../middleware/validateRequestBody.middleware.js';
import { Router } from 'express';
import { CompressingImageTinyPNGController } from '../../../controllers/external/tinyPNG/CompressingImage.controller.js';
import {
  compressingImageFromUrlDTO,
  CompressingImageFromUrlDTO
} from '../../../dto/request/external/tinyPNG/compressingImage/fromURL.dto.js';
import { UploadMulterMiddleware } from '../../../middleware/UploadMulter.middleware.js';

export const router = Router();

const compressingImageTinyPNGController = new CompressingImageTinyPNGController();

const shrinkImageMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'file' });

const validateRequestBodyShrinkFromURL = validateRequestBody<CompressingImageFromUrlDTO>(compressingImageFromUrlDTO);

router.post(
  '/from-url',
  validateRequestBodyShrinkFromURL,
  compressingImageTinyPNGController.fromURL.bind(compressingImageTinyPNGController)
);

router.post(
  '/from-local',
  shrinkImageMulterMiddleware.singleUpload.bind(shrinkImageMulterMiddleware),
  compressingImageTinyPNGController.fromLocalImage.bind(compressingImageTinyPNGController)
);
