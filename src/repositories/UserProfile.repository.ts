import { UpdateUserProfileRequestBody } from 'src/schema/zod/api/requests/userProfile.schema.js';
import { IUserProfileDocument, UserProfile } from '../models/userProfile.model.js';
import { UserProfileSchemaType } from '../schema/zod/userProfile/index.schema.js';

type CreateParams = UserProfileSchemaType;
type FindByUserAuthIdParams = {
  userAuthId: string;
};

type UpdateAvatarParams = {
  userProfile: IUserProfileDocument;
  url: string;
  publicId: string;
};

type DeleteAvatarParams = {
  userProfile: IUserProfileDocument;
};

type UpdateParams = {
  updateData: UpdateUserProfileRequestBody;
  userProfileId: string;
};

interface IUserProfileRepository {
  create: (params: CreateParams) => Promise<IUserProfileDocument>;
  findByUserAuthId: (params: FindByUserAuthIdParams) => Promise<IUserProfileDocument | null>;
  updateAvatar: (params: UpdateAvatarParams) => Promise<IUserProfileDocument>;
  deleteAvatar: (params: DeleteAvatarParams) => Promise<IUserProfileDocument>;
  update: (params: UpdateParams) => Promise<IUserProfileDocument | null>;
}

export class UserProfileRepository implements IUserProfileRepository {
  private _userProfile: typeof UserProfile = UserProfile;
  constructor() {}

  public async create(data: CreateParams): Promise<IUserProfileDocument> {
    return await this._userProfile.create(data);
  }

  public async findByUserAuthId({ userAuthId }: FindByUserAuthIdParams): Promise<IUserProfileDocument | null> {
    return await this._userProfile.findOne({
      userAuthId: userAuthId
    });
  }

  public async updateAvatar({ userProfile, url, publicId }: UpdateAvatarParams): Promise<IUserProfileDocument> {
    userProfile.avatar = {
      publicId,
      url
    };
    await userProfile.save();
    return userProfile;
  }

  public async deleteAvatar({ userProfile }: DeleteAvatarParams): Promise<IUserProfileDocument> {
    userProfile.avatar = null;
    await userProfile.save();
    return userProfile;
  }

  public async update({ userProfileId, updateData }: UpdateParams): Promise<IUserProfileDocument | null> {
    const userProfile = await this._userProfile.findByIdAndUpdate(userProfileId, updateData, {
      new: true
    });
    return userProfile;
  }
}
