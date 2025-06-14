import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UploadImageService } from '../../services/UploadImage.service.js';
import { sendSuccessResponse } from '../../utils/responses.util.js';
import { CloudinaryFolder } from 'src/enums/cloudinaryFolder.enum.js';

type DeleteLogoBrandRequestType = Request<{ public_id: string }, unknown, unknown>;
type DeleteBannerBrandRequestType = Request<{ public_id: string }>;

interface IUploadImageController {
  uploadLogoBrand: (request: Request, response: Response, next: NextFunction) => Promise<void>;
  deleteLogoBrand: (request: DeleteLogoBrandRequestType, response: Response, next: NextFunction) => Promise<void>;
  uploadBannerBrand: (request: Request, response: Response, next: NextFunction) => Promise<void>;
  deleteBannerBrand: (request: DeleteBannerBrandRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class UploadImageController implements IUploadImageController {
  private _uploadImageService: UploadImageService = new UploadImageService();

  constructor() {}

  public async uploadLogoBrand(request: Request, response: Response): Promise<void> {
    const file = request.file as Express.Multer.File;

    const { publicId, url } = await this._uploadImageService.uploadLogoBrand({
      fileBuffer: file.buffer,
      originalFileName: file.originalname
    });

    sendSuccessResponse<{ publicId: string; url: string }>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Upload logo brand success',
        data: {
          publicId,
          url
        }
      }
    });
  }

  public async deleteLogoBrand(request: DeleteLogoBrandRequestType, response: Response): Promise<void> {
    const { public_id } = request.params;
    await this._uploadImageService.deleteLogoBrand({ publicId: public_id });

    sendSuccessResponse<{ publicId: string }>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Delete logo brand success',
        data: {
          publicId: `${CloudinaryFolder.LOGOS_BRAND}/${public_id}`
        }
      }
    });
  }

  public async uploadBannerBrand(request: Request, response: Response): Promise<void> {
    const file = request.file as Express.Multer.File;

    const { publicId, url } = await this._uploadImageService.uploadBannerBrand({
      fileBuffer: file.buffer,
      originalFileName: file.originalname
    });

    sendSuccessResponse<{
      publicId: string;
      url: string;
    }>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Upload image banner brand success',
        data: {
          publicId,
          url
        }
      }
    });
  }

  public async deleteBannerBrand(request: DeleteBannerBrandRequestType, response: Response): Promise<void> {
    const { public_id } = request.params;
    await this._uploadImageService.deleteBannerBrand({ publicId: public_id });

    sendSuccessResponse<{ publicId: string }>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Delete image banner brand success',
        data: {
          publicId: `${CloudinaryFolder.BANNERS_BRAND}/${public_id}`
        }
      }
    });
  }
}
