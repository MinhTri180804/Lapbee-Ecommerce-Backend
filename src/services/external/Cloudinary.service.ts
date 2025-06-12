import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import path from 'path';
import streamifier from 'streamifier';
import { v4 as uuidV4 } from 'uuid';
import { env } from '../../configs/env.config.js';
import { CloudinaryFolder } from '../../enums/cloudinaryFolder.enum.js';
import { CloudinaryUploadError } from '../../errors/CloudinaryUpload.error.js';

export class CloudinaryService {
  private _folder: CloudinaryFolder;
  private _cloudinaryName: string = env.cloudinary.NAME as string;
  private _cloudinaryKey: string = env.cloudinary.KEY as string;
  private _cloudinarySecret: string = env.cloudinary.SECRET as string;
  constructor(folder: CloudinaryFolder) {
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

  public async upload(filePath: string): Promise<UploadApiResponse> {
    return await cloudinary.uploader.upload(filePath, {
      folder: this._folder
    });
  }

  public async uploadStream(fileBuffer: Buffer, originalFileName: string): Promise<{ public_id: string; url: string }> {
    return new Promise((resolve, reject) => {
      const fileExt = path.extname(originalFileName);
      const fileName = path.basename(originalFileName, fileExt);
      const suffix = this._generateSuffix();
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: this._folder,
          public_id: `${fileName}_${suffix}`
        },
        (error, result) => {
          if (error) {
            reject(new CloudinaryUploadError({ errorCloudinary: error }));
            return;
          }

          resolve({
            url: result!.secure_url,
            public_id: result!.public_id
          });
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  }

  public async delete({ publicId }: { publicId: string }) {
    return await cloudinary.uploader.destroy(publicId);
  }
}
