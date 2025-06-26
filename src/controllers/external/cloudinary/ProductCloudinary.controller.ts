import { NextFunction, Request, Response } from 'express';
import { CloudinaryService } from '../../../services/external/Cloudinary.service.js';
import { ProductCloudinaryRequestDTO } from '../../../dto/request/external/cloudinary/product/index.dto.js';
import { CloudinaryFolder } from '../../../enums/cloudinaryFolder.enum.js';
import { StateProductEnum } from '../../../enums/stateProduct.enum.js';
import { ProductCloudinaryResponseDTO } from '../../../dto/response/external/cloudinary/product/index.dto.js';
import { UploadProductImageDTO } from '../../../dto/request/external/cloudinary/product/uploadNewProductImage.dto.js';
import { sendSuccessResponse } from '../../../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type UploadProductImageRequestType = Request<unknown, unknown, UploadProductImageDTO>;
type DeleteProductImageRequestType = Request<{
  publicId: string;
}>;

// TODO: Refactor stateProductConstant in here ** note ** Can merge it with StateProductEnum
const StateProductConstant: {
  [key in StateProductEnum]: string;
} = {
  0: 'new',
  1: 'used'
};

interface IProductCloudinaryController {
  uploadProductImage: (request: UploadProductImageRequestType, response: Response, next: NextFunction) => Promise<void>;

  deleteProductImage: (request: DeleteProductImageRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class ProductCloudinaryController implements IProductCloudinaryController {
  constructor() {}

  public async uploadProductImage(request: UploadProductImageRequestType, response: Response): Promise<void> {
    const file = request.file as Express.Multer.File;
    const { slug, state } = ProductCloudinaryRequestDTO.uploadProductImage(request.body);
    const cloudinaryService = new CloudinaryService(CloudinaryFolder.PRODUCT);
    const resultUploaded = await cloudinaryService.uploadStream({
      fileBuffer: file.buffer,
      originalFileName: file.originalname,
      remainingPathDirectory: `/${StateProductConstant[state]}/${slug}`,
      needSuffix: false,
      isOverwrite: false
    });

    const resultUploadedResponse = ProductCloudinaryResponseDTO.uploadProductImage(resultUploaded);

    sendSuccessResponse<typeof resultUploadedResponse>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Upload new product image success',
        data: resultUploadedResponse
      }
    });
  }

  public async deleteProductImage(request: DeleteProductImageRequestType, response: Response): Promise<void> {
    const { publicId } = request.params;
    console.log('PublicId: ', publicId);
    const cloudinaryService = new CloudinaryService(CloudinaryFolder.PRODUCT);
    await cloudinaryService.delete({ publicId });

    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.NO_CONTENT,
        message: 'delete product image success'
      }
    });
  }
}
