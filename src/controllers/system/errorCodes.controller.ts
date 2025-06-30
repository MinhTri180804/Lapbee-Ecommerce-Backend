import { NextFunction, Request, Response } from 'express';
import { sendSuccessResponse } from '../../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';
import { ErrorCodes } from '../../constants/errorCodes.constant.js';

interface IErrorCodesController {
  getErrorCodes: (request: Request, response: Response, next: NextFunction) => Promise<void>;
}

export class ErrorCodesController implements IErrorCodesController {
  constructor() {}

  public async getErrorCodes(_: Request, response: Response): Promise<void> {
    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get errorCodes success',
        data: ErrorCodes
      }
    });
  }
}
