import { uploadLogoDTO, UploadLogoDTO } from './uploadLogo.dto.js';
import { uploadBannerDTO, UploadBannerDTO } from './uploadBanner.dto.js';

export class BrandCloudinaryRequestDTO {
  constructor() {}

  static uploadLogo(data: UploadLogoDTO): UploadLogoDTO {
    return uploadLogoDTO.parse(data);
  }

  static uploadBanner(data: UploadBannerDTO): UploadLogoDTO {
    return uploadBannerDTO.parse(data);
  }
}
