import { NextFunction, Request, Response } from 'express';
import { BrandCloudinaryRequestDTO } from '../../../dto/request/external/cloudinary/brand/index.dto.js';
import { BrandCloudinaryResponseDTO } from '../../../dto/response/external/cloudinary/brand/index.dto.js';
import { UploadLogoDTO as BrandUploadLogoDTO } from '../../../dto/request/external/cloudinary/brand/uploadLogo.dto.js';
import { CloudinaryService } from '../../../services/external/Cloudinary.service.js';
import { CloudinaryFolder } from '../../../enums/cloudinaryFolder.enum.js';
import { sendSuccessResponse } from '../../../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type UploadLogoRequestType = Request<unknown, unknown, BrandUploadLogoDTO>;

interface IBrandCloudinaryController {
  uploadLogo: (request: UploadLogoRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class BrandCloudinaryController implements IBrandCloudinaryController {
  constructor() {}

  public async uploadLogo(request: UploadLogoRequestType, response: Response): Promise<void> {
    const file = request.file as Express.Multer.File;
    const { nameBrand } = BrandCloudinaryRequestDTO.uploadLogo(request.body);

    const cloudinaryService = new CloudinaryService(CloudinaryFolder.BRAND);
    const uploadResponse = await cloudinaryService.uploadStream({
      fileBuffer: file.buffer,
      originalFileName: file.originalname,
      needSuffix: true,
      remainingPathDirectory: `/${nameBrand}/logo`
    });

    const responseData = BrandCloudinaryResponseDTO.uploadLogo(uploadResponse);

    sendSuccessResponse<typeof responseData>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Upload logo brand success',
        data: responseData
      }
    });
  }
}
