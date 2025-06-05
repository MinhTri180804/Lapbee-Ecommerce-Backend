import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IoredisManager } from 'src/configs/ioredisManager.config.js';
import { UserAuthRepository } from 'src/repositories/UserAuth.repository.js';
import { IoredisService } from 'src/services/Ioredis.service.js';
import {
  RegisterLocalRequestBody,
  VerifyEmailRegisterRequestBody
} from '../../schema/zod/api/requests/auth/local.schema.js';
import { AuthLocalService } from '../../services/auth/local.service.js';
import { sendSuccessResponse } from '../../utils/responses.util.js';

type RegisterRequestType = Request<unknown, unknown, RegisterLocalRequestBody>;
type VerifyEmailRequestType = Request<unknown, unknown, VerifyEmailRegisterRequestBody>;

interface IAuthLocalController {
  register: (request: RegisterRequestType, response: Response, next: NextFunction) => void;
  verifyEmail: (request: VerifyEmailRequestType, response: Response, next: NextFunction) => void;
}

export class AuthLocalController implements IAuthLocalController {
  private _userAuthRepository: UserAuthRepository = new UserAuthRepository();

  constructor() {}

  public async register(request: RegisterRequestType, response: Response) {
    const { email } = request.body;
    const redis = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redis);
    const authLocalService = new AuthLocalService(this._userAuthRepository, ioredisService);
    await authLocalService.register({ email });

    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Verification code sent successfully'
      }
    });
  }

  public async verifyEmail(request: VerifyEmailRequestType, response: Response) {
    const { email, otp } = request.body;
    const redis = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redis);
    const authLocalService = new AuthLocalService(this._userAuthRepository, ioredisService);
    const { tokenSetPassword, email: emailVerifyRegister } = await authLocalService.verifyEmailRegister({ email, otp });
    sendSuccessResponse<{ tokenSetPassword: string; email: string }>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Verification email register success',
        data: {
          email: emailVerifyRegister,
          tokenSetPassword
        }
      }
    });
  }
}
