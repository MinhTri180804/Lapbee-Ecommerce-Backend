import { IUserProfileDocument, UserProfile } from '../models/userProfile.model';
import { UserProfileSchemaType } from '../schema/zod/userProfile/index.schema';

type CreateParams = UserProfileSchemaType;
type FindByUserAuthIdParams = {
  userAuthId: string;
};

interface IUserProfileRepository {
  create: (params: CreateParams) => Promise<IUserProfileDocument>;
  findByUserAuthId: (params: FindByUserAuthIdParams) => Promise<IUserProfileDocument | null>;
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
}
