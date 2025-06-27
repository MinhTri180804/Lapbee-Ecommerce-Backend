import { NextFunction, Request, Response } from 'express';
import { BrandCloudinaryRequestDTO } from '../../../dto/request/external/cloudinary/brand/index.dto.js';
import { BrandCloudinaryResponseDTO } from '../../../dto/response/external/cloudinary/brand/index.dto.js';
import { UploadLogoDTO as BrandUploadLogoDTO } from '../../../dto/request/external/cloudinary/brand/uploadLogo.dto.js';
import { CloudinaryService } from '../../../services/external/Cloudinary.service.js';
import { CloudinaryFolder } from '../../../enums/cloudinaryFolder.enum.js';
import { sendSuccessResponse } from '../../../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';
import { UploadBannerDTO as BrandUploadBannerDTO } from '../../../dto/request/external/cloudinary/brand/uploadBanner.dto.js';

type UploadLogoRequestType = Request<unknown, unknown, BrandUploadLogoDTO>;
type UploadBannerRequestType = Request<unknown, unknown, BrandUploadBannerDTO>;
type DeleteLogoRequestType = Request<{ publicId: string }>;

interface IBrandCloudinaryController {
  uploadLogo: (request: UploadLogoRequestType, response: Response, next: NextFunction) => Promise<void>;
  uploadBanner: (request: UploadBannerRequestType, response: Response, next: NextFunction) => Promise<void>;
  deleteLogo: (request: DeleteLogoRequestType, response: Response, next: NextFunction) => Promise<void>;
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
      remainingPathDirectory: `/${nameBrand}/logos`
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

  public async uploadBanner(request: UploadBannerRequestType, response: Response): Promise<void> {
    const file = request.file as Express.Multer.File;
    const { nameBrand } = BrandCloudinaryRequestDTO.uploadBanner(request.body);

    const cloudinaryService = new CloudinaryService(CloudinaryFolder.BRAND);
    const uploadResponse = await cloudinaryService.uploadStream({
      fileBuffer: file.buffer,
      originalFileName: file.originalname,
      remainingPathDirectory: `/${nameBrand}/banners`,
      needSuffix: true,
      isOverwrite: false
    });

    const responseData = BrandCloudinaryResponseDTO.uploadBanner(uploadResponse);
    sendSuccessResponse<typeof responseData>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Upload banner for brand success',
        data: responseData
      }
    });
  }

  public async deleteLogo(request: DeleteLogoRequestType, response: Response): Promise<void> {
    const { publicId } = request.params;

    const cloudinaryService = new CloudinaryService(CloudinaryFolder.BRAND);
    await cloudinaryService.delete({ publicId });
    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'Delete Logo brand is success'
      }
    });
  }
}
