import { UploadApiResponse } from 'cloudinary';
import { uploadProductImageDTO, UploadProductImageDTO } from './uploadNewProductImage.dto.js';

export class ProductCloudinaryResponseDTO {
  constructor() {}

  static uploadProductImage(data: UploadApiResponse): UploadProductImageDTO {
    const candidate: UploadProductImageDTO = {
      publicId: data.public_id,
      url: data.secure_url
    };

    return uploadProductImageDTO.parse(candidate);
  }
}
