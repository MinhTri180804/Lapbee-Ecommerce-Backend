import { uploadProductImageDTO, UploadProductImageDTO } from './uploadProductImage.dto.js';

export class ProductCloudinaryRequestDTO {
  constructor() {}

  static uploadProductImage(data: UploadProductImageDTO): UploadProductImageDTO {
    const candidate: UploadProductImageDTO = {
      slug: data.slug,
      state: Number(data.state)
    };

    return uploadProductImageDTO.parse(candidate);
  }
}
