import { CloudinaryFolder } from '../enums/cloudinaryFolder.enum.js';
import { CloudinaryService } from './external/Cloudinary.service.js';

type UploadLogoBrandParams = {
  fileBuffer: Buffer;
  originalFileName: string;
};

type DeleteLogoBrandParams = {
  publicId: string;
};

interface IUploadImageService {
  uploadLogoBrand: (params: UploadLogoBrandParams) => Promise<{
    publicId: string;
    url: string;
  }>;

  deleteLogoBrand: (params: DeleteLogoBrandParams) => Promise<void>;
}

export class UploadImageService implements IUploadImageService {
  constructor() {}

  public async uploadLogoBrand({ fileBuffer, originalFileName }: UploadLogoBrandParams): Promise<{
    publicId: string;
    url: string;
  }> {
    const cloudinaryService = new CloudinaryService(CloudinaryFolder.LOGO_BRAND);
    const { url, public_id } = await cloudinaryService.uploadStream(fileBuffer, originalFileName);

    return {
      url,
      publicId: public_id
    };
  }

  public async deleteLogoBrand({ publicId }: DeleteLogoBrandParams): Promise<void> {
    const cloudinaryService = new CloudinaryService(CloudinaryFolder.LOGO_BRAND);
    await cloudinaryService.delete({ publicId });

    return;
  }
}
