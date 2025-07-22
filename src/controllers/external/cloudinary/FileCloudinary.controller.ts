import { sendSuccessResponse } from './../../../utils/responses.util.js';
import { CloudinaryService } from './../../../services/external/Cloudinary.service.js';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FileCloudinaryResponseDTO } from '../../../dto/response/external/cloudinary/file/index.dto.js';
import { UploadFileResourcesDTO } from '../../../dto/request/external/cloudinary/file/uploadFileResources.dto.js';
import { FileCloudinaryRequestDTO } from '../../../dto/request/external/cloudinary/file/index.dto.js';
import { UploadFileResourcesFromLinkDTO } from 'src/dto/request/external/cloudinary/file/uploadFileResourcesFromLink.dto.js';

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

type UploadFileResourcesFromLocalRequestType = Request<unknown, unknown, UploadFileResourcesDTO>;

type UploadFileResourcesFromLinkRequestType = Request<unknown, unknown, UploadFileResourcesFromLinkDTO>;

interface IFileCloudinaryController {
  getAllFileResources: (request: GetAllFilesRequestType, response: Response, next: NextFunction) => Promise<void>;
  searchFileResources: (
    request: SearchFileResourcesRequestType,
    response: Response,
    next: NextFunction
  ) => Promise<void>;
  uploadFileResourcesFromLocal: (request: UploadFileResourcesFromLocalRequestType, response: Response) => Promise<void>;
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

  public async uploadFileResourcesFromLocal(
    request: UploadFileResourcesFromLocalRequestType,
    response: Response
  ): Promise<void> {
    const file = request.file as Express.Multer.File;
    const { rename = null, folderPath } = FileCloudinaryRequestDTO.uploadFileResources(request.body);

    const cloudinaryService = new CloudinaryService(folderPath);
    const result = await cloudinaryService.uploadStream({
      fileBuffer: file.buffer,
      originalFileName: rename ? rename : file.originalname,
      remainingPathDirectory: '',
      needSuffix: false,
      isOverwrite: false
    });

    // const { data } = FileCloudinaryResponseDTO.uploadFileResources(result);

    sendSuccessResponse<typeof result>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Upload file resources success',
        data: result
      }
    });
  }

  public async uploadFileResourcesFromLink(
    request: UploadFileResourcesFromLinkRequestType,
    response: Response
  ): Promise<void> {
    const { link, folderPath, filename } = FileCloudinaryRequestDTO.uploadFileResourcesFromLink(request.body);

    const cloudinaryService = new CloudinaryService(folderPath);
    const result = await cloudinaryService.uploadFileResourcesFromLink({ link, folderPath, filename });

    sendSuccessResponse<typeof result>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Upload file resources from link success',
        data: result
      }
    });
  }
}
