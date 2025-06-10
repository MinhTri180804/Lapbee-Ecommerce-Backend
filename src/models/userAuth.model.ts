import { Document, model, Schema } from 'mongoose';
import { UserAuthProviderEnum } from '../enums/userAuthProvider.enum.js';
import { UserAuthRoleEnum } from '../enums/userAuthRole.enum.js';
import { UserAuthSchemaType } from '../schema/zod/userAuth/index.schema.js';
import { hashPassword } from '../utils/password.util.js';

const DOCUMENT_NAME = 'user_auth';
const COLLECTION_NAME = 'users_auth';

export interface IUserAuthDocument extends UserAuthSchemaType, Document {
  isSetPassword: boolean;
}

const userAuthSchema = new Schema<IUserAuthDocument>(
  {
    email: {
      type: String,
      default: null
    },
    password: {
      type: String,
      default: null
    },
    passwordConfirm: {
      type: String,
      select: false
    },
    role: {
      type: String,
      enum: Object.values(UserAuthRoleEnum),
      default: UserAuthRoleEnum.CUSTOMER
    },
    provider: {
      type: String,
      enum: Object.values(UserAuthProviderEnum)
    },
    userProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'user_profile',
      default: null
    },
    isVerify: {
      type: Boolean,
      default: false
    },
    isFirstLogin: {
      type: Boolean,
      default: true
    },
    zaloId: {
      type: String,
      default: null
    },
    jtiSetPassword: {
      type: String,
      default: null
    },
    blockedStatus: {
      isBlocked: {
        type: Boolean,
        default: false
      },
      message: {
        type: String,
        default: null
      }
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

userAuthSchema.virtual('isSetPassword').get(function () {
  const condition =
    (this.provider == UserAuthProviderEnum.LOCAL || this.provider == UserAuthProviderEnum.BOTH) &&
    this.email &&
    this.isVerify &&
    this.password;

  if (condition) {
    return true;
  }
  return false;
});

userAuthSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();

  this.passwordConfirm = undefined;
  const encryptPassword = await hashPassword({ password: this.password });
  this.password = encryptPassword;
  return next();
});

export const UserAuth = model<IUserAuthDocument>(DOCUMENT_NAME, userAuthSchema);
