import { Router } from 'express';
import { FileCloudinaryController } from '../../../../controllers/external/cloudinary/FileCloudinary.controller.js';
import { validateRequestBody } from '../../../../middleware/validateRequestBody.middleware.js';
import {
  uploadFileResourcesDTO,
  UploadFileResourcesDTO
} from '../../../../dto/request/external/cloudinary/file/uploadFileResources.dto.js';
import { UploadMulterMiddleware } from 'src/middleware/UploadMulter.middleware.js';

export const router = Router();

const fileCloudinaryController = new FileCloudinaryController();

const validateUploadFileResources = validateRequestBody<UploadFileResourcesDTO>(uploadFileResourcesDTO);
const uploadFileResourcesMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'file' });

router.get('/', fileCloudinaryController.getAllFileResources.bind(fileCloudinaryController));

router.get('/search', fileCloudinaryController.searchFileResources.bind(fileCloudinaryController));

router.post(
  '/upload/from-local',
  uploadFileResourcesMulterMiddleware.singleUpload.bind(uploadFileResourcesMulterMiddleware),
  validateUploadFileResources,
  fileCloudinaryController.uploadFileResources.bind(fileCloudinaryController)
);
