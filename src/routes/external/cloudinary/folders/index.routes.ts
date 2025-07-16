import { Router } from 'express';
import { FolderCloudinaryController } from '../../../../controllers/external/cloudinary/FolderCloudinary.controller.js';

export const router = Router();
const folderCloudinaryController = new FolderCloudinaryController();

router.get('/root', folderCloudinaryController.getRoot.bind(folderCloudinaryController));
router.get('/sub', folderCloudinaryController.getSubFolder.bind(folderCloudinaryController));
