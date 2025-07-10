import { getRootFolderDTO, GetRootFolderDTO } from './getRootFolder.dto.js';
import { GetRootFoldersResponse } from '../../../../../types/cloudinary.type.js';

export class FolderCloudinaryResponseDTO {
  constructor() {}

  static getRootFolder(data: GetRootFoldersResponse): GetRootFolderDTO {
    const folders: GetRootFolderDTO['data'] = data.folders.map((folder) => ({
      name: folder.name,
      path: folder.path,
      externalId: folder.external_id
    }));
    const timeFormat = new Date(data.rate_limit_reset_at!).toISOString();
    const candidate: GetRootFolderDTO = {
      data: folders,
      metadata: {
        nextCursor: data!.next_cursor!,
        totalCount: data!.total_count!,
        rateLimitAllowed: data.rate_limit_allowed!,
        rateLimitRemaining: data.rate_limit_remaining!,
        rateLimitResetAt: timeFormat
      }
    };

    return getRootFolderDTO.parse(candidate);
  }
}
