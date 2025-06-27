import { uploadLogoDTO, UploadLogoDTO } from './uploadLogo.dto.js';

export class BrandCloudinaryRequestDTO {
  constructor() {}

  static uploadLogo(data: UploadLogoDTO): UploadLogoDTO {
    return uploadLogoDTO.parse(data);
  }
}
