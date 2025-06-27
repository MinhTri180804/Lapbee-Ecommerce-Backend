import { uploadLogoDTO, UploadLogoDTO } from './uploadLogo.dto.js';
import { uploadBannerDTO, UploadBannerDTO } from './uploadBanner.dto.js';
import { UploadApiResponse } from 'cloudinary';

export class BrandCloudinaryResponseDTO {
  constructor() {}

  static uploadLogo(data: UploadApiResponse): UploadLogoDTO {
    const candidate: UploadLogoDTO = {
      url: data.secure_url,
      publicId: data.public_id
    };

    return uploadLogoDTO.parse(candidate);
  }

  static uploadBanner(data: UploadApiResponse): UploadBannerDTO {
    const candidate: UploadBannerDTO = {
      publicId: data.public_id,
      url: data.secure_url
    };

    return uploadBannerDTO.parse(candidate);
  }
}
