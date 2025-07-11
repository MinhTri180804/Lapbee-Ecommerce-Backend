import { Router } from 'express';
import { FileCloudinaryController } from '../../../../controllers/external/cloudinary/FileCloudinary.controller.js';

export const router = Router();

const fileCloudinaryController = new FileCloudinaryController();

router.get('/', fileCloudinaryController.getAllFileResources.bind(fileCloudinaryController));
