import { NextFunction, Request, Response } from 'express';
import { RegisterLocalRequestBody } from '../../schema/zod/api/requests/auth/local.schema.js';
import { AuthLocalService } from '../../services/auth/local.service.js';
import { sendSuccessResponse } from '../../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type RegisterRequestType = Request<unknown, unknown, RegisterLocalRequestBody>;

interface IAuthLocalController {
  register: (request: Request, response: Response, next: NextFunction) => void;
}

export class AuthLocalController implements IAuthLocalController {
  constructor() {}

  public async register(request: RegisterRequestType, response: Response) {
    const { email } = request.body;
    const authLocalService = new AuthLocalService();
    await authLocalService.register({ email });

    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Verification code sent successfully'
      }
    });
  }
}
