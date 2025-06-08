import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IoredisManager } from 'src/configs/ioredisManager.config.js';
import { UserAuthRepository } from 'src/repositories/UserAuth.repository.js';
import { IoredisService } from 'src/services/Ioredis.service.js';
import {
  ForgotPasswordRequestBody,
  LoginRequestBody,
  RegisterLocalRequestBody,
  ResendSetPasswordTokenRequestBody,
  ResendVerifyEmailRequestBody,
  SetPasswordRequestBody,
  VerifyEmailRegisterRequestBody
} from '../../schema/zod/api/requests/auth/local.schema.js';
import { AuthLocalService } from '../../services/auth/local.service.js';
import { sendSuccessResponse } from '../../utils/responses.util.js';

type RegisterRequestType = Request<unknown, unknown, RegisterLocalRequestBody>;
type VerifyEmailRequestType = Request<unknown, unknown, VerifyEmailRegisterRequestBody>;
type SetPasswordRequestType = Request<unknown, unknown, SetPasswordRequestBody>;
type ResendVerifyEmailRequestType = Request<unknown, unknown, ResendVerifyEmailRequestBody>;
type ResendSetPasswordTokenRequestType = Request<unknown, unknown, ResendSetPasswordTokenRequestBody>;
type LoginRequestType = Request<unknown, unknown, LoginRequestBody>;
type ForgotPasswordRequestType = Request<unknown, unknown, ForgotPasswordRequestBody>;

interface IAuthLocalController {
  register: (request: RegisterRequestType, response: Response, next: NextFunction) => void;
  verifyEmail: (request: VerifyEmailRequestType, response: Response, next: NextFunction) => void;
  setPassword: (request: SetPasswordRequestType, response: Response, next: NextFunction) => Promise<void>;
  resendVerifyEmail: (request: ResendVerifyEmailRequestType, response: Response, next: NextFunction) => Promise<void>;
  resendSetPasswordToken: (
    request: ResendSetPasswordTokenRequestType,
    response: Response,
    next: NextFunction
  ) => Promise<void>;
  login: (request: LoginRequestType, response: Response, next: NextFunction) => Promise<void>;
  forgotPassword: (request: ForgotPasswordRequestType, response: Response, next: NextFunction) => Promise<void>;
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

  public async setPassword(request: SetPasswordRequestType, response: Response) {
    const { tokenSetPassword, password, passwordConfirm } = request.body;
    const redis = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redis);
    const authLocalService = new AuthLocalService(this._userAuthRepository, ioredisService);
    const { accessToken, refreshToken } = await authLocalService.setPassword({
      tokenSetPassword,
      password,
      passwordConfirm
    });
    sendSuccessResponse<{ accessToken: typeof accessToken; refreshToken: typeof refreshToken }>({
      response,
      content: {
        statusCode: StatusCodes.CREATED,
        message: 'Create account password success',
        data: {
          accessToken,
          refreshToken
        }
      }
    });
  }

  public async resendVerifyEmail(request: ResendVerifyEmailRequestType, response: Response) {
    const { email } = request.body;
    const redis = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redis);
    const authLocalService = new AuthLocalService(this._userAuthRepository, ioredisService);
    await authLocalService.resendVerifyEmail({ email });
    sendSuccessResponse<null>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Resend pin code verify email success',
        data: null
      }
    });
  }

  public async resendSetPasswordToken(request: ResendSetPasswordTokenRequestType, response: Response): Promise<void> {
    const { email } = request.body;
    const redis = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redis);
    const authLocalService = new AuthLocalService(this._userAuthRepository, ioredisService);
    await authLocalService.resendSetPasswordToken({ email });
    sendSuccessResponse<null>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Resend setPasswordToken success'
      }
    });
  }

  public async login(request: LoginRequestType, response: Response) {
    const { email, password } = request.body;
    const redis = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redis);
    const authLocalService = new AuthLocalService(this._userAuthRepository, ioredisService);
    const { accessToken, refreshToken } = await authLocalService.login({ email, password });
    sendSuccessResponse<{ accessToken: string; refreshToken: string }>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Login success',
        data: {
          accessToken,
          refreshToken
        }
      }
    });
  }

  public async forgotPassword(request: ForgotPasswordRequestType, response: Response) {
    const { email } = request.body;
    const redis = IoredisManager.getInstance().getRedisClient();
    const ioredisService = new IoredisService(redis);
    const authLocalService = new AuthLocalService(this._userAuthRepository, ioredisService);
    await authLocalService.forgotPassword({ email });
    sendSuccessResponse<null>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'If your email exists in our system, a reset link has been sent.'
      }
    });
  }
}
