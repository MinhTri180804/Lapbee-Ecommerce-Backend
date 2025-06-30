import { getMeDTO, GetMeDTO } from './getMe.dto.js';
import { IUserProfileDocument } from '../../../models/userProfile.model.js';

export class UserProfileResponseDTO {
  constructor() {}

  static getMe(
    data: IUserProfileDocument & {
      userAuthId: {
        email: string;
        role: number;
      };
    }
  ): GetMeDTO {
    const candidate: GetMeDTO = {
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar,
      email: data.userAuthId.email,
      role: Number(data.userAuthId.role),
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString()
    };

    return getMeDTO.parse(candidate);
  }
}
