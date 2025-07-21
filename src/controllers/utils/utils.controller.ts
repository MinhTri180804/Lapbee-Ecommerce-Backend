import { UtilsService } from './../../services/utils/Utils.service.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from './../../errors/BadRequest.error.js';
import { NextFunction, Request, Response } from 'express';
import { sendSuccessResponse } from '../../utils/responses.util.js';

type ImageSizeFromUrlRequestType = Request<
  unknown,
  unknown,
  unknown,
  {
    url: string;
  }
>;

interface IUtilsController {
  imageSizeFromUrl: (request: ImageSizeFromUrlRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class UtilsController implements IUtilsController {
  private readonly _utilsService: UtilsService = new UtilsService();

  constructor() {}

  public imageSizeFromUrl = async (request: ImageSizeFromUrlRequestType, response: Response) => {
    const { url } = request.query;

    if (!url) {
      throw new BadRequestError({ message: 'Url query params is required' });
    }

    const { size } = await this._utilsService.imageSizeFromUrl(url);
    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get image size success',
        data: {
          size
        }
      }
    });
  };
}
