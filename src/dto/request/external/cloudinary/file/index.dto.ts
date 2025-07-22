import { UploadFileResourcesDTO, uploadFileResourcesDTO } from './uploadFileResources.dto.js';
import { UploadFileResourcesFromLinkDTO, uploadFileResourcesFromLinkDTO } from './uploadFileResourcesFromLink.dto.js';

export class FileCloudinaryRequestDTO {
  constructor() {}

  static uploadFileResources(data: UploadFileResourcesDTO) {
    return uploadFileResourcesDTO.parse(data);
  }

  static uploadFileResourcesFromLink(data: UploadFileResourcesFromLinkDTO) {
    return uploadFileResourcesFromLinkDTO.parse(data);
  }
}
