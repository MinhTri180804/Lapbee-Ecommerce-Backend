import { decode, JwtPayload } from 'jsonwebtoken';
import { CloudinaryFolder } from 'src/enums/cloudinaryFolder.enum.js';
import { UserAvatarMissingError } from '../errors/UserAvatarMissing.error.js';
import { UserNotExistError } from '../errors/UserNotExist.error.js';
import { UserProfileCreatedError } from '../errors/UserProfileCreated.error.js';
import { UserProfileNotExistError } from '../errors/UserProfileNotExist.error.js';
import { IUserProfileDocument } from '../models/userProfile.model.js';
import { UserAuthRepository } from '../repositories/UserAuth.repository.js';
import { UserProfileRepository } from '../repositories/UserProfile.repository.js';
import {
  CreateUserProfileRequestBody,
  UpdateUserProfileRequestBody
} from '../schema/zod/api/requests/userProfile.schema.js';
import { CloudinaryService } from './external/Cloudinary.service.js';

type CreateParams = CreateUserProfileRequestBody & {
  accessToken: string;
};

type GetMeParams = {
  accessToken: string;
};

type UpdateAvatarParams = {
  accessToken: string;
  fileBuffer: Buffer;
  originalFileName: string;
};

type DeleteAvatarParams = {
  accessToken: string;
};

type UpdateParams = {
  accessToken: string;
  updateData: UpdateUserProfileRequestBody;
};

interface IUserProfileService {
  create: (params: CreateParams) => Promise<IUserProfileDocument>;
  getMe: (params: GetMeParams) => Promise<IUserProfileDocument>;
  updateAvatar: (params: UpdateAvatarParams) => Promise<{
    publicId: string;
    url: string;
  }>;
  deleteAvatar: (params: DeleteAvatarParams) => Promise<void>;
  update: (params: UpdateParams) => Promise<IUserProfileDocument>;
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
    avatar = null,
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
      avatar,
      phone
    });

    await userAuthRepository.updateUserProfileId({
      userAuth,
      userProfileId: userProfile.id
    });

    return userProfile;
  }

  public async getMe({ accessToken }: GetMeParams): Promise<IUserProfileDocument> {
    const { sub } = decode(accessToken) as JwtPayload;
    const userProfile = await this._userProfileRepository.findByUserAuthId({ userAuthId: sub as string });
    if (!userProfile) {
      throw new UserProfileNotExistError({});
    }

    return userProfile;
  }

  public async updateAvatar({ accessToken, fileBuffer, originalFileName }: UpdateAvatarParams): Promise<{
    publicId: string;
    url: string;
  }> {
    const { sub } = decode(accessToken) as JwtPayload;
    const profile = await this._userProfileRepository.findByUserAuthId({ userAuthId: sub as string });
    if (!profile) {
      throw new UserProfileNotExistError({});
    }
    const cloudinaryService = new CloudinaryService(CloudinaryFolder.USER_AVATAR);

    if (profile.avatar) {
      await cloudinaryService.delete({ publicId: profile.avatar.publicId });
    }

    const { public_id, url } = await cloudinaryService.uploadStream(fileBuffer, originalFileName);
    await this._userProfileRepository.updateAvatar({
      userProfile: profile,
      url,
      publicId: public_id
    });

    return { publicId: public_id, url };
  }

  public async deleteAvatar({ accessToken }: DeleteAvatarParams): Promise<void> {
    const { sub } = decode(accessToken) as JwtPayload;
    const profile = await this._userProfileRepository.findByUserAuthId({ userAuthId: sub as string });
    if (!profile) {
      throw new UserProfileNotExistError({});
    }

    if (!profile.avatar) {
      throw new UserAvatarMissingError({});
    }

    const cloudinaryService = new CloudinaryService(CloudinaryFolder.USER_AVATAR);
    await cloudinaryService.delete({ publicId: profile.avatar.publicId });
    await this._userProfileRepository.deleteAvatar({ userProfile: profile });
    return;
  }

  public async update({ accessToken, updateData }: UpdateParams) {
    const { sub: userAuthId } = decode(accessToken) as JwtPayload;
    const userProfile = await this._userProfileRepository.findByUserAuthId({ userAuthId: userAuthId as string });
    if (!userProfile) {
      throw new UserProfileNotExistError({});
    }

    const userProfileUpdate = await this._userProfileRepository.update({
      userProfileId: userProfile.id,
      updateData
    });

    if (!userProfileUpdate) {
      throw new UserProfileNotExistError({});
    }

    return userProfileUpdate;
  }
}
