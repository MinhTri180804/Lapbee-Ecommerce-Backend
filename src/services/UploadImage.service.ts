import { CloudinaryFolder } from '../enums/cloudinaryFolder.enum.js';
import { CloudinaryService } from './external/Cloudinary.service.js';

type UploadLogoBrandParams = {
  fileBuffer: Buffer;
  originalFileName: string;
};

type UploadBannerBrandParams = {
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

  uploadBannerBrand: (params: UploadBannerBrandParams) => Promise<{
    publicId: string;
    url: string;
  }>;
}

export class UploadImageService implements IUploadImageService {
  constructor() {}

  public async uploadLogoBrand({ fileBuffer, originalFileName }: UploadLogoBrandParams): Promise<{
    publicId: string;
    url: string;
  }> {
    const cloudinaryService = new CloudinaryService(CloudinaryFolder.LOGOS_BRAND);
    const { url, public_id } = await cloudinaryService.uploadStream(fileBuffer, originalFileName);

    return {
      url,
      publicId: public_id
    };
  }

  public async deleteLogoBrand({ publicId }: DeleteLogoBrandParams): Promise<void> {
    const cloudinaryService = new CloudinaryService(CloudinaryFolder.LOGOS_BRAND);
    await cloudinaryService.delete({ publicId });

    return;
  }

  public async uploadBannerBrand({ fileBuffer, originalFileName }: UploadBannerBrandParams): Promise<{
    publicId: string;
    url: string;
  }> {
    const cloudinaryService = new CloudinaryService(CloudinaryFolder.BANNERS_BRAND);
    const { public_id, url } = await cloudinaryService.uploadStream(fileBuffer, originalFileName);

    return {
      publicId: public_id,
      url
    };
  }
}
