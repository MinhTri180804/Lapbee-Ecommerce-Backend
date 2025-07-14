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

type SearchFileResourcesRequestType = Request<
  unknown,
  unknown,
  unknown,
  {
    filename?: string;
    folder?: string;
    maxResult?: string;
    nextCursor?: string;
  }
>;

interface IFileCloudinaryController {
  getAllFileResources: (request: GetAllFilesRequestType, response: Response, next: NextFunction) => Promise<void>;
  searchFileResources: (
    request: SearchFileResourcesRequestType,
    response: Response,
    next: NextFunction
  ) => Promise<void>;
}

const DEFAULT_MAX_RESULT_SEARCH = 10;

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

  public async searchFileResources(request: SearchFileResourcesRequestType, response: Response): Promise<void> {
    const { filename = '', folder = '', maxResult = DEFAULT_MAX_RESULT_SEARCH, nextCursor = null } = request.query;
    const cloudinaryService = new CloudinaryService(folder);
    const result = await cloudinaryService.searchFileResources({ filename, maxResult: Number(maxResult), nextCursor });

    const { data, metadata } = FileCloudinaryResponseDTO.searchFileResources(result);

    sendSuccessResponse<typeof data, typeof metadata>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Search file resources success',
        data,
        metadata
      }
    });
  }
}
