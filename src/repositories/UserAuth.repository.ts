import { IUserAuthDocument, UserAuth } from '../models/userAuth.model.js';

type FindByEmailParams = {
  email: string;
};

interface IUserAuthRepository {
  findByEmail: (params: FindByEmailParams) => Promise<IUserAuthDocument | null>;
}

export class UserAuthRepository implements IUserAuthRepository {
  private userAuthModel: typeof UserAuth;
  constructor(userAuthModel: typeof UserAuth) {
    this.userAuthModel = userAuthModel;
  }

  public async findByEmail({ email }: FindByEmailParams) {
    return await this.userAuthModel.findOne({ email });
  }
}
