import { NextFunction, Request, Response } from 'express';
import { UploadImageService } from '../../services/UploadImage.service';
import { sendSuccessResponse } from '../../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

interface IUploadImageController {
  logoBrand: (request: Request, response: Response, next: NextFunction) => Promise<void>;
}

export class UploadImageController implements IUploadImageController {
  private _uploadImageService: UploadImageService = new UploadImageService();

  constructor() {}

  public async logoBrand(request: Request, response: Response) {
    const file = request.file as Express.Multer.File;

    const { publicId, url } = await this._uploadImageService.logoBrand({
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
}
