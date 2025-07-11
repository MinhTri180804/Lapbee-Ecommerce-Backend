import { sendSuccessResponse } from './../../../utils/responses.util.js';
import { CloudinaryService } from './../../../services/external/Cloudinary.service.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FileCloudinaryResponseDTO } from '../../../dto/response/external/cloudinary/file/index.dto.js';

type GetAllFilesRequestType = Request<
  unknown,
  unknown,
  unknown,
  {
    nextCursor?: string;
  }
>;

interface IFileCloudinaryController {
  getAllFileResources: (request: GetAllFilesRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class FileCloudinaryController implements IFileCloudinaryController {
  constructor() {}

  public async getAllFileResources(request: GetAllFilesRequestType, response: Response): Promise<void> {
    const { nextCursor = null } = request.query;
    const cloudinaryService = new CloudinaryService('root');
    const result = await cloudinaryService.getAllFilesResources({ nextCursor });

    const { data, metadata } = FileCloudinaryResponseDTO.getAllFileResource(result);

    sendSuccessResponse<typeof data, typeof metadata>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get all file resources success',
        data,
        metadata
      }
    });
  }
}
