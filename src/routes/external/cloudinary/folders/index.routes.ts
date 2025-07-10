import { Router } from 'express';
import { FolderCloudinaryController } from '../../../../controllers/external/cloudinary/FolderCloudinary.controller';

export const router = Router();
const folderCloudinaryController = new FolderCloudinaryController();

router.get('/root', folderCloudinaryController.getRoot.bind(folderCloudinaryController));
