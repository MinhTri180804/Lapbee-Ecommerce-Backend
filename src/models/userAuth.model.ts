import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserAuthRoleEnum } from '../enums/userAuthRole.enum.js';
import { UserAuthProviderEnum } from '../enums/userAuthProvider.enum.js';

const DOCUMENT_NAME = 'users_auth';
const COLLECTION_NAME = 'user_auth';

const userAuth = new Schema(
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

userAuth.virtual('isSetPassword').get(function () {
  if (this.provider == UserAuthProviderEnum.LOCAL || this.provider == UserAuthProviderEnum.BOTH) {
    return this.password === null;
  }
  return false;
});

userAuth.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.passwordConfirm = undefined;
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

export const UserAuth = model(DOCUMENT_NAME, userAuth);
