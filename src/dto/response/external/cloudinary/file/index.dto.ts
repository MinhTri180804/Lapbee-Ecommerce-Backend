import { GetAllFilesResourceResponse, SearchFileResourcesResponse } from './../../../../../types/cloudinary.type.js';
import { getAllFileResourcesDTO, GetAllFileResourcesDTO } from './getAllFileResources.dto.js';
import { searchFileResourcesDTO, SearchFileResourcesDTO } from './searchFileResources.dto.js';

export class FileCloudinaryResponseDTO {
  constructor() {}

  static getAllFileResource(data: GetAllFilesResourceResponse) {
    const fileResources: GetAllFileResourcesDTO['data'] = data.resources.map((fileResource) => {
      const createdAtFormat = new Date(fileResource.created_at).toISOString();
      return {
        assetId: fileResource.asset_id,
        assetFolder: fileResource.asset_folder,
        format: fileResource.format,
        resourceType: fileResource.resource_type,
        createdAt: createdAtFormat,
        bytes: fileResource.bytes,
        publicId: fileResource.public_id,
        displayName: fileResource.display_name,
        width: fileResource.width,
        height: fileResource.height,
        secureUrl: fileResource.secure_url
      };
    });

    const resentAtFormat = new Date(data.rate_limit_reset_at!).toISOString();

    const candidate: GetAllFileResourcesDTO = {
      data: fileResources,
      metadata: {
        nextCursor: data.next_cursor! || null,
        rateLimitAllowed: data.rate_limit_allowed!,
        rateLimitRemaining: data.rate_limit_remaining!,
        rateLimitResetAt: resentAtFormat
      }
    };

    return getAllFileResourcesDTO.parse(candidate);
  }

  static searchFileResources(data: SearchFileResourcesResponse) {
    const fileResources: SearchFileResourcesDTO['data'] = data.resources.map((fileResource) => {
      const createdAtFormat = new Date(fileResource.created_at).toISOString();
      return {
        assetId: fileResource.asset_id,
        assetFolder: fileResource.asset_folder,
        format: fileResource.format,
        resourceType: fileResource.resource_type,
        createdAt: createdAtFormat,
        bytes: fileResource.bytes,
        publicId: fileResource.public_id,
        displayName: fileResource.display_name,
        width: fileResource.width,
        height: fileResource.height,
        secureUrl: fileResource.secure_url
      };
    });

    const resentAtFormat = new Date(data.rate_limit_reset_at!).toISOString();

    const candidate: SearchFileResourcesDTO = {
      data: fileResources,
      metadata: {
        nextCursor: data.next_cursor || null,
        rateLimitAllowed: data.rate_limit_allowed!,
        rateLimitRemaining: data.rate_limit_remaining!,
        rateLimitResetAt: resentAtFormat,
        totalCount: data.total_count
      }
    };

    return searchFileResourcesDTO.parse(candidate);
  }
}
