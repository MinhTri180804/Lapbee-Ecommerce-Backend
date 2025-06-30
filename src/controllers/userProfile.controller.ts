import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserProfileRepository } from '../repositories/UserProfile.repository.js';
import {
  CreateUserProfileRequestBody,
  UpdateUserProfileRequestBody,
  updateUserProfileRequestBodySchema
} from '../schema/zod/api/requests/userProfile.schema.js';
import { UserProfileService } from '../services/userProfile.service.js';
import { sendSuccessResponse } from '../utils/responses.util.js';

type CreateRequestType = Request<unknown, unknown, CreateUserProfileRequestBody>;
type GetMeRequestType = Request;
type UpdateAvatarRequestType = Request;
type DeleteAvatarRequestType = Request;
type UpdateRequestType = Request<unknown, unknown, UpdateUserProfileRequestBody>;

interface IUserProfileController {
  create: (request: CreateRequestType, response: Response, next: NextFunction) => Promise<void>;
  getMe: (request: GetMeRequestType, response: Response, next: NextFunction) => Promise<void>;
  updateAvatar: (request: UpdateAvatarRequestType, response: Response, next: NextFunction) => Promise<void>;
  deleteAvatar: (request: DeleteAvatarRequestType, response: Response, next: NextFunction) => Promise<void>;
  update: (request: UpdateRequestType, response: Response, next: NextFunction) => Promise<void>;
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
    const accessToken = request.cookies.accessToken as string;

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

  public async updateAvatar(request: UpdateAvatarRequestType, response: Response): Promise<void> {
    const accessToken = request.headers['authorization']!.split(' ')[1];
    const file = request.file as Express.Multer.File;

    const { publicId, url } = await this._userProfileService.updateAvatar({
      accessToken,
      fileBuffer: file.buffer,
      originalFileName: file.originalname
    });

    sendSuccessResponse<{ publicId: string; url: string }>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Update avatar success',
        data: {
          publicId,
          url
        }
      }
    });
  }

  public async deleteAvatar(request: DeleteAvatarRequestType, response: Response): Promise<void> {
    const accessToken = request.headers['authorization']!.split(' ')[1];

    await this._userProfileService.deleteAvatar({ accessToken });
    sendSuccessResponse({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Delete avatar success'
      }
    });
  }

  public async update(request: UpdateRequestType, response: Response): Promise<void> {
    const accessToken = request.headers['authorization']!.split(' ')[1];
    const updateData = updateUserProfileRequestBodySchema.parse(request.body);
    const userProfile = await this._userProfileService.update({ accessToken, updateData });
    sendSuccessResponse<typeof userProfile>({
      response,
      content: {
        statusCode: StatusCodes.OK,
        message: 'Update user profile success',
        data: userProfile
      }
    });
  }
}
