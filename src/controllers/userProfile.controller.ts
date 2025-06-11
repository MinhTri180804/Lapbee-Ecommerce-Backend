import { NextFunction, Request, Response } from 'express';
import { CreateUserProfileRequestBody } from '../schema/zod/api/requests/userProfile.schema';
import { UserProfileService } from '../services/userProfile.service';
import { UserProfileRepository } from '../repositories/UserProfile.repository';
import { sendSuccessResponse } from '../utils/responses.util.js';
import { StatusCodes } from 'http-status-codes';

type CreateRequestType = Request<unknown, unknown, CreateUserProfileRequestBody>;

interface IUserProfileController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
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
}
