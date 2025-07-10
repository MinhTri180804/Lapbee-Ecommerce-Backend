import { NextFunction, Request, Response } from 'express';
import { CloudinaryService } from '../../../services/external/Cloudinary.service.js';
import { sendSuccessResponse } from '../../../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';
import { FolderCloudinaryResponseDTO } from '../../../dto/response/external/cloudinary/folder/index.dto.js';

type GetRootRequestType = Request;

interface IFolderCloudinaryController {
  getRoot: (request: GetRootRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class FolderCloudinaryController implements IFolderCloudinaryController {
  constructor() {}

  public async getRoot(request: GetRootRequestType, response: Response): Promise<void> {
    const cloudinaryService = new CloudinaryService('root');
    const responseCloudinary = await cloudinaryService.getRootFolder();

    const { metadata, data } = FolderCloudinaryResponseDTO.getRootFolder(responseCloudinary);

    sendSuccessResponse<typeof data, typeof metadata>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get all root folder success',
        data,
        metadata
      }
    });
  }
}
