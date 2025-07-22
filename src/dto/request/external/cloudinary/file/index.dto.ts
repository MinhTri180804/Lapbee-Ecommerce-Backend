import { UploadFileResourcesDTO, uploadFileResourcesDTO } from './uploadFileResources.dto.js';

export class FileCloudinaryRequestDTO {
  constructor() {}

  static uploadFileResources(data: UploadFileResourcesDTO) {
    return uploadFileResourcesDTO.parse(data);
  }
}
