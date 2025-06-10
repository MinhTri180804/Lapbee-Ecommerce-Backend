import { UserAuthRoleEnum } from 'src/enums/userAuthRole.enum.js';
import { IUserAuthDocument, UserAuth } from '../models/userAuth.model.js';
import { UserAuthProviderEnum } from 'src/enums/userAuthProvider.enum.js';

type FindByEmailParams = {
  email: string;
};

type VerifyEmailRegisterParams = {
  userAuthId: string;
  jti: string;
};

type CreateRegisterLocalParams = {
  email: string;
};

type CreatePasswordParams = {
  userAuth: IUserAuthDocument;
  password: string;
  passwordConfirm: string;
};

type UpdateJtiSetPasswordParams = {
  userAuth: IUserAuthDocument;
  jtiSetPassword: string;
};

type FindByIdParams = {
  userAuthId: string;
};

type UpdatePasswordParams = {
  userAuthId: string;
  newPassword: string;
};

type DoesUserProfileExistParams = {
  userAuthId: string;
};

interface IUserAuthRepository {
  findByEmail: (params: FindByEmailParams) => Promise<IUserAuthDocument | null>;
  verifyEmailRegister: (params: VerifyEmailRegisterParams) => Promise<boolean>;
  findById: (params: FindByIdParams) => Promise<IUserAuthDocument | null>;
  createPassword: (params: CreatePasswordParams) => Promise<IUserAuthDocument>;
  updateJtiSetPassword: (params: UpdateJtiSetPasswordParams) => Promise<IUserAuthDocument>;
  updatePassword: (params: UpdatePasswordParams) => Promise<boolean>;
  doesUserProfileExist: (params: DoesUserProfileExistParams) => Promise<boolean>;
}

export class UserAuthRepository implements IUserAuthRepository {
  private _userAuthModel: typeof UserAuth = UserAuth;
  constructor() {}

  public async findByEmail({ email }: FindByEmailParams) {
    return await this._userAuthModel.findOne({ email });
  }

  public async verifyEmailRegister({ userAuthId, jti }: VerifyEmailRegisterParams): Promise<boolean> {
    const result = await this._userAuthModel.updateOne(
      {
        _id: userAuthId
      },
      {
        jtiSetPassword: jti,
        isVerify: true
      }
    );
    return result.matchedCount > 0;
  }

  public async createRegisterLocal({ email }: CreateRegisterLocalParams): Promise<IUserAuthDocument> {
    const userAuth = await this._userAuthModel.create({
      email,
      role: UserAuthRoleEnum.CUSTOMER,
      provider: UserAuthProviderEnum.LOCAL
    });

    return userAuth;
  }

  public async findById({ userAuthId }: FindByIdParams) {
    const userAuth = await this._userAuthModel.findById(userAuthId);
    return userAuth;
  }

  public async createPassword({
    userAuth,
    password,
    passwordConfirm
  }: CreatePasswordParams): Promise<IUserAuthDocument> {
    userAuth.password = password;
    userAuth.passwordConfirm = passwordConfirm;
    userAuth.jtiSetPassword = null;
    const data = await userAuth.save();
    return data;
  }

  public async updateJtiSetPassword({
    userAuth,
    jtiSetPassword
  }: UpdateJtiSetPasswordParams): Promise<IUserAuthDocument> {
    userAuth.jtiSetPassword = jtiSetPassword;
    await userAuth.save();
    return userAuth;
  }

  public async updatePassword({ userAuthId, newPassword }: UpdatePasswordParams): Promise<boolean> {
    const result = await this._userAuthModel.updateOne(
      { _id: userAuthId },
      {
        password: newPassword
      }
    );

    return result.matchedCount > 0;
  }

  public async doesUserProfileExist({ userAuthId }: DoesUserProfileExistParams): Promise<boolean> {
    const result = await this._userAuthModel.exists({
      _id: userAuthId,
      userProfileId: { $ne: null }
    });

    if (result === null) return false;

    return true;
  }
}
