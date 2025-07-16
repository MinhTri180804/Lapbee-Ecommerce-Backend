import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import { v4 as uuidV4 } from 'uuid';
import { env } from '../../configs/env.config.js';
import { CloudinaryFolder } from '../../enums/cloudinaryFolder.enum.js';
import { CloudinaryUploadError } from '../../errors/CloudinaryUpload.error.js';
import {
  GetAllFilesResourceResponse,
  GetRootFoldersResponse,
  GetSubFoldersResponse,
  SearchFileResourcesResponse
} from '../../types/cloudinary.type.js';
import path from 'node:path';

type UploadStreamParams = {
  fileBuffer: Buffer;
  originalFileName: string;
  remainingPathDirectory: string;
  needSuffix: boolean;
  isOverwrite?: boolean;
};

type GetAllFilesResourcesParams = {
  nextCursor: string | null;
};

type SearchFileResourcesParams = {
  filename: string;
  maxResult: number;
  nextCursor: string | null;
};

interface ICloudinaryService {
  uploadStream: (params: UploadStreamParams) => Promise<UploadApiResponse>;
  getRootFolder: () => Promise<GetRootFoldersResponse>;
  getSubFolder: () => Promise<GetSubFoldersResponse>;
  getAllFilesResources: (params: GetAllFilesResourcesParams) => Promise<GetAllFilesResourceResponse>;
  searchFileResources: (params: SearchFileResourcesParams) => Promise<SearchFileResourcesResponse>;
}

export class CloudinaryService implements ICloudinaryService {
  private _folder: CloudinaryFolder | string;
  private _cloudinaryName: string = env.cloudinary.NAME as string;
  private _cloudinaryKey: string = env.cloudinary.KEY as string;
  private _cloudinarySecret: string = env.cloudinary.SECRET as string;
  constructor(folder: CloudinaryFolder | string) {
    this._folder = folder;
    cloudinary.config({
      cloud_name: this._cloudinaryName,
      api_key: this._cloudinaryKey,
      api_secret: this._cloudinarySecret
    });
  }

  private _generateSuffix() {
    return uuidV4().slice(0, 6);
  }

  public async getAllImages() {
    return await cloudinary.api.resources({ resource_type: 'image', type: 'upload' });
  }

  public async upload(filePath: string): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(filePath, {
      folder: this._folder
    });
  }

  public async uploadStream({
    fileBuffer,
    originalFileName,
    remainingPathDirectory,
    needSuffix,
    isOverwrite = false
  }: UploadStreamParams): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const fileExt = path.extname(originalFileName);
      const fileName = path.basename(originalFileName, fileExt).replaceAll(' ', '_');
      const publicId = needSuffix ? `${fileName}_${this._generateSuffix()}` : fileName;
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: `${this._folder}${remainingPathDirectory}`,
          public_id: publicId,
          overwrite: isOverwrite,
          transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }]
        },
        (error, result) => {
          if (error) {
            reject(new CloudinaryUploadError({ errorCloudinary: error }));
            return;
          }

          resolve(result as UploadApiResponse);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  }

  public async delete({ publicId }: { publicId: string }) {
    return await cloudinary.uploader.destroy(publicId);
  }

  public async getRootFolder(): Promise<GetRootFoldersResponse> {
    const result = await cloudinary.api.root_folders();
    return result;
  }

  public async getSubFolder(): Promise<GetSubFoldersResponse> {
    const result = await cloudinary.api.sub_folders(this._folder);
    return result;
  }

  public async getAllFilesResources({ nextCursor }: GetAllFilesResourcesParams): Promise<GetAllFilesResourceResponse> {
    console.log(nextCursor);
    const result = await cloudinary.api.resources({ next_cursor: nextCursor });
    return result;
  }

  public async searchFileResources({
    filename,
    maxResult,
    nextCursor
  }: SearchFileResourcesParams): Promise<SearchFileResourcesResponse> {
    const paramsExpression = [];

    if (this._folder !== '') {
      paramsExpression.push(`folder:${this._folder}`);
    }

    if (filename !== '') {
      paramsExpression.push(`filename:${encodeURIComponent(filename)}`);
    }

    console.log(paramsExpression);

    const result: cloudinary.search = cloudinary.search
      .expression(paramsExpression.join(' AND '))
      .max_results(maxResult);

    if (nextCursor) {
      result.next_cursor(nextCursor);
    }
    return await result.execute();
  }
}
