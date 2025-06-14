import { CloudinaryFolder } from '../enums/cloudinaryFolder.enum.js';
import { CloudinaryService } from './external/Cloudinary.service.js';

type LogoBrandParams = {
  fileBuffer: Buffer;
  originalFileName: string;
};

interface IUploadImageService {
  logoBrand: (params: LogoBrandParams) => Promise<{
    publicId: string;
    url: string;
  }>;
}

export class UploadImageService implements IUploadImageService {
  constructor() {}

  public async logoBrand({ fileBuffer, originalFileName }: LogoBrandParams): Promise<{
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
}
