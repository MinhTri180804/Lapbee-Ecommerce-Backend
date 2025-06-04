import { UserAuthRoleEnum } from 'src/enums/userAuthRole.enum.js';
import { IUserAuthDocument, UserAuth } from '../models/userAuth.model.js';
import { UserAuthProviderEnum } from 'src/enums/userAuthProvider.enum.js';

type FindByEmailParams = {
  email: string;
};

type UpdateJtiSetPasswordParams = {
  userAuthId: string;
  jti: string;
};

type CreateRegisterLocalParams = {
  email: string;
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

  public async createRegisterLocal({ email }: CreateRegisterLocalParams): Promise<IUserAuthDocument> {
    const userAuth = await this._userAuthModel.create({
      email,
      role: UserAuthRoleEnum.CUSTOMER,
      provider: UserAuthProviderEnum.LOCAL,
      isVerify: false,
      isFirstLogin: false,
      zaloId: false,
      jtiSetPassword: false
    });

    return userAuth;
  }
}
