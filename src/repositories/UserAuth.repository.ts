import { IUserAuthDocument, UserAuth } from '../models/userAuth.model.js';

type FindByEmailParams = {
  email: string;
};

type UpdateJtiSetPasswordParams = {
  userAuthId: string;
  jti: string;
};

interface IUserAuthRepository {
  findByEmail: (params: FindByEmailParams) => Promise<IUserAuthDocument | null>;
}

export class UserAuthRepository implements IUserAuthRepository {
  private _userAuthModel: typeof UserAuth = UserAuth;
  constructor() {}

  public async findByEmail({ email }: FindByEmailParams) {
    return await this._userAuthModel.findOne({ email });
  }

  public async updateJtiSetPassword({ userAuthId, jti }: UpdateJtiSetPasswordParams): Promise<boolean> {
    const result = await this._userAuthModel.updateOne({ id: userAuthId, jtiSetPassword: jti });
    return result.matchedCount > 0;
  }
}
