import { Document, model, Schema } from 'mongoose';
import { UserProfileSchemaType } from '../schema/zod/userProfile/index.schema.js';

const DOCUMENT_NAME = 'user_profile';
const COLLECTION_NAME = 'users_profile';

export interface IUserProfileDocument extends UserProfileSchemaType, Document {}

const avatarSchema = new Schema<IUserProfileDocument['avatar']>(
  {
    publicId: {
      type: String
    },
    url: {
      type: String
    }
  },
  { _id: false }
);

const userProfileSchema = new Schema<IUserProfileDocument>(
  {
    userAuthId: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    avatar: {
      type: avatarSchema,
      default: null
    },
    phone: {
      Type: String
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

export const UserProfile = model<IUserProfileDocument>(DOCUMENT_NAME, userProfileSchema);
