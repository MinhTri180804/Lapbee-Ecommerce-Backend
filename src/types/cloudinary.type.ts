import { AdminApiBaseResponse, AdminApiPaginationResponse } from 'cloudinary';

type Folder = {
  name: string;
  path: string;
  external_id: string;
};

export type GetRootFoldersResponse = AdminApiBaseResponse &
  AdminApiPaginationResponse & {
    folders: Folder[];
    total_count: number;
  };
