import { CreateUserProfileRequestBody } from '../schema/zod/api/requests/userProfile.schema.js';
import { UserProfileRepository } from '../repositories/UserProfile.repository.js';
import { IUserProfileDocument } from '../models/userProfile.model.js';
import { decode, JwtPayload } from 'jsonwebtoken';
import { UserAuthRepository } from '../repositories/UserAuth.repository.js';
import { UserProfileCreatedError } from '../errors/UserProfileCreated.error.js';
import { UserNotExistError } from '../errors/UserNotExist.error.js';

type CreateParams = CreateUserProfileRequestBody & {
  accessToken: string;
};

interface IUserProfileService {
  create: (params: CreateParams) => Promise<IUserProfileDocument>;
}

export class UserProfileService implements IUserProfileService {
  private _userProfileRepository: UserProfileRepository;
  constructor(userProfileRepository: UserProfileRepository) {
    this._userProfileRepository = userProfileRepository;
  }

  public async create({
    phone,
    firstName,
    lastName,
    avatarUrl = null,
    accessToken
  }: CreateParams): Promise<IUserProfileDocument> {
    const { sub } = decode(accessToken) as JwtPayload;
    const userAuthRepository = new UserAuthRepository();
    const userAuth = await userAuthRepository.findById({ userAuthId: sub as string });
    if (!userAuth) {
      throw new UserNotExistError({});
    }

    if (userAuth.userProfileId) {
      throw new UserProfileCreatedError({});
    }

    const userProfile = await this._userProfileRepository.create({
      userAuthId: userAuth.id,
      firstName,
      lastName,
      avatarUrl,
      phone
    });

    await userAuthRepository.updateUserProfileId({
      userAuth,
      userProfileId: userProfile.id
    });

    return userProfile;
  }
}
