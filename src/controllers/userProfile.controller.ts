import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserProfileRepository } from '../repositories/UserProfile.repository.js';
import { CreateUserProfileRequestBody } from '../schema/zod/api/requests/userProfile.schema.js';
import { UserProfileService } from '../services/userProfile.service.js';
import { sendSuccessResponse } from '../utils/responses.util.js';

type CreateRequestType = Request<unknown, unknown, CreateUserProfileRequestBody>;
type GetMeRequestType = Request;

interface IUserProfileController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
  getMe: (request: GetMeRequestType, response: Response, next: NextFunction) => Promise<void>;
}

export class UserProfileController implements IUserProfileController {
  private _userProfileRepository: UserProfileRepository = new UserProfileRepository();
  private _userProfileService: UserProfileService = new UserProfileService(this._userProfileRepository);

  public async create(request: CreateRequestType, response: Response) {
    const data = request.body;
    const accessToken = request.headers['authorization']!.split(' ')[1];

    const userProfileData = await this._userProfileService.create({ accessToken, ...data });
    sendSuccessResponse<typeof userProfileData>({
      response,
      content: {
        statusCode: StatusCodes.CREATED,
        message: 'Create profile success',
        data: userProfileData
      }
    });
  }

  public async getMe(request: GetMeRequestType, response: Response) {
    const accessToken = request.headers['authorization']!.split(' ')[1];

    const userProfileData = await this._userProfileService.getMe({ accessToken });
    sendSuccessResponse<typeof userProfileData>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Get me profile success',
        data: userProfileData
      }
    });
  }
}
