import { Router } from 'express';
import { FileCloudinaryController } from '../../../../controllers/external/cloudinary/FileCloudinary.controller.js';
import { validateRequestBody } from '../../../../middleware/validateRequestBody.middleware.js';
import {
  uploadFileResourcesDTO,
  UploadFileResourcesDTO
} from '../../../../dto/request/external/cloudinary/file/uploadFileResources.dto.js';
import {
  uploadFileResourcesFromLinkDTO,
  UploadFileResourcesFromLinkDTO
} from '../../../../dto/request/external/cloudinary/file/uploadFileResourcesFromLink.dto.js';
import { UploadMulterMiddleware } from 'src/middleware/UploadMulter.middleware.js';

export const router = Router();

const fileCloudinaryController = new FileCloudinaryController();

const validateUploadFileResources = validateRequestBody<UploadFileResourcesDTO>(uploadFileResourcesDTO);
const validateUploadFileResourcesFromLink =
  validateRequestBody<UploadFileResourcesFromLinkDTO>(uploadFileResourcesFromLinkDTO);

const uploadFileResourcesMulterMiddleware = new UploadMulterMiddleware({ fieldName: 'file' });

router.get('/', fileCloudinaryController.getAllFileResources.bind(fileCloudinaryController));

router.get('/search', fileCloudinaryController.searchFileResources.bind(fileCloudinaryController));

router.post(
  '/upload/from-local',
  uploadFileResourcesMulterMiddleware.singleUpload.bind(uploadFileResourcesMulterMiddleware),
  validateUploadFileResources,
  fileCloudinaryController.uploadFileResourcesFromLocal.bind(fileCloudinaryController)
);

router.post(
  '/upload/from-link',
  validateUploadFileResourcesFromLink,
  fileCloudinaryController.uploadFileResourcesFromLink.bind(fileCloudinaryController)
);
