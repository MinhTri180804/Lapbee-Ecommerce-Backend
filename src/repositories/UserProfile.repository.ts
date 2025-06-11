import { IUserProfileDocument, UserProfile } from '../models/userProfile.model';
import { UserProfileSchemaType } from '../schema/zod/userProfile/index.schema';

type CreateParams = UserProfileSchemaType;

interface IUserProfileRepository {
  create: (params: CreateParams) => Promise<IUserProfileDocument>;
}

export class UserProfileRepository implements IUserProfileRepository {
  private _userProfile: typeof UserProfile = UserProfile;
  constructor() {}

  public async create(data: CreateParams): Promise<IUserProfileDocument> {
    return await this._userProfile.create(data);
  }
}
