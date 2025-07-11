import { AdminApiBaseResponse, AdminApiPaginationResponse } from 'cloudinary';

type Folder = {
  name: string;
  path: string;
  external_id: string;
};

export type FileResource = {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  asset_folder: string;
  display_name: string;
  url: string;
  secure_url: string;
};

export type GetRootFoldersResponse = AdminApiBaseResponse &
  AdminApiPaginationResponse & {
    folders: Folder[];
    total_count: number;
  };

export type GetSubFoldersResponse = AdminApiBaseResponse &
  AdminApiPaginationResponse & {
    folders: Folder[];
    total_count: number;
  };

export type GetAllFilesResourceResponse = AdminApiBaseResponse &
  AdminApiPaginationResponse & {
    resources: FileResource[];
  };
