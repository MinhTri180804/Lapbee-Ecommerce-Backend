import { model, Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserAuthRoleEnum } from '../enums/userAuthRole.enum.js';
import { UserAuthProviderEnum } from '../enums/userAuthProvider.enum.js';
import { UserAuthSchemaType } from '../schema/zod/userAuth.schema.js';

const DOCUMENT_NAME = 'users_auth';
const COLLECTION_NAME = 'user_auth';

interface IUserAuthDocument extends UserAuthSchemaType, Document {
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
    this.password;

  if (condition) {
    return !this.password;
  }
  return false;
});

userAuthSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();

  this.passwordConfirm = undefined;
  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
  return next();
});

export const UserAuth = model<IUserAuthDocument>(DOCUMENT_NAME, userAuthSchema);
