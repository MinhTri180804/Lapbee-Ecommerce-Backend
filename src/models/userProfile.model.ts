import { Document, model, Schema } from 'mongoose';
import { UserProfileSchemaType } from '../schema/zod/userProfile/index.schema.js';

const DOCUMENT_NAME = 'user_profile';
const COLLECTION_NAME = 'users_profile';

export interface IUserProfileDocument extends UserProfileSchemaType, Document {}

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
    avatarUrl: {
      type: String,
      default: ''
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
